import ts from 'typescript';
import { Source } from '../lib/source.js';
import { createPropertyAccess } from '../lib/utils.js';
import { createModuleAnnotation } from '../lib/annotations.js';

export class AppModule extends Source {
  constructor({ entities }) {
    super({ name: 'AppModule', type: 'app' });
    this._addImports({ entities });
    this._entities = entities;
  }

  _addImports({ entities }) {
    this.addImport({ fields: ['resolve'], module: 'path' })
      .addImport({ fields: ['Module'], module: '@nestjs/common' })
      .addImport({ fields: ['TypeOrmModule'], module: '@nestjs/typeorm' });

    entities.forEach((entity) =>
      this.addImport({
        fields: [entity.getModuleName()],
        module: `../module/${entity.getModuleName()}`
      })
    );
    entities.forEach((entity) =>
      this.addImport({
        fields: [entity.getEntityName()],
        module: `../entity/${entity.getEntityName()}`
      })
    );
  }

  _createOrmConfigLoading() {
    const ormConfig = ts.factory.createVariableStatement(
      [ts.factory.createModifier(ts.SyntaxKind.ConstKeyword)],
      ts.factory.createVariableDeclaration(
        'ormconfig',
        undefined,
        undefined,
        ts.factory.createCallExpression(
          ts.factory.createIdentifier('require'),
          undefined,
          [
            ts.factory.createCallExpression(
              ts.factory.createIdentifier('resolve'),
              undefined,
              [
                ts.factory.createCallExpression(
                  createPropertyAccess('process.cwd')
                ),
                ts.factory.createStringLiteral('ormconfig.json', true)
              ]
            )
          ]
        )
      )
    );

    return ormConfig;
  }

  _createModuleAnnotation() {
    const modulesLiterals = this._entities.map((entity) =>
      ts.factory.createIdentifier(entity.getModuleName())
    );
    const entitiesLiterals = this._entities.map((entity) =>
      ts.factory.createIdentifier(entity.getEntityName())
    );

    const config = ts.factory.createObjectLiteralExpression([
      ts.factory.createPropertyAssignment(
        'entities',
        ts.factory.createArrayLiteralExpression(entitiesLiterals)
      ),
      ts.factory.createSpreadAssignment(
        ts.factory.createIdentifier('ormconfig')
      )
    ]);

    const moduleAnnotation = createModuleAnnotation({
      imports: [
        ts.factory.createCallExpression(
          createPropertyAccess('TypeOrmModule.forRoot'),
          undefined,
          [config]
        ),
        ...modulesLiterals
      ]
    });

    return moduleAnnotation;
  }

  buildSourceFile() {
    const classNode = ts.factory.createClassDeclaration(
      [this._createModuleAnnotation()],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      'AppModule',
      undefined,
      undefined,
      []
    );

    return ts.factory.createSourceFile([
      ...this.buildImports(),
      this._createOrmConfigLoading(),
      classNode
    ]);
  }
}
