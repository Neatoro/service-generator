import { Source } from '../lib/source.js';
import { createModuleAnnotation } from '../lib/annotations.js';
import ts from 'typescript';
import { createPropertyAccess } from '../lib/utils.js';


export class EntityModule extends Source {
  constructor({ entity }) {
    super({ name: entity.getModuleName(), type: 'module' });

    this._addImports({ entity });
    this._moduleAnnotation = createModuleAnnotation({
      imports: [
        ts.factory.createCallExpression(
          createPropertyAccess('TypeOrmModule.forFeature'),
          undefined,
          [
            ts.factory.createArrayLiteralExpression([
              ts.factory.createIdentifier(entity.getEntityName())
            ])
          ]
        )
      ],
      controllers: [ts.factory.createIdentifier(entity.getControllerName())],
      providers: [ts.factory.createIdentifier(entity.getServiceName())]
    });
  }

  _addImports({ entity }) {
    this.addImport({ fields: ['Module'], module: '@nestjs/common' })
      .addImport({ fields: ['TypeOrmModule'], module: '@nestjs/typeorm' })
      .addImport({
        fields: [entity.getControllerName()],
        module: `../controller/${entity.getControllerName()}`
      })
      .addImport({
        fields: [entity.getServiceName()],
        module: `../service/${entity.getServiceName()}`
      })
      .addImport({
        fields: [entity.getEntityName()],
        module: `../entity/${entity.getEntityName()}`
      });
  }

  buildSourceFile() {
    const classNode = ts.factory.createClassDeclaration(
      [this._moduleAnnotation],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.name,
      undefined,
      undefined,
      []
    );

    return this.createSourceFile([...this.buildImports(), classNode]);
  }
}
