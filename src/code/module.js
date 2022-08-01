import ts from 'typescript';
import { createModuleAnnotation } from './lib/annotations.js';
import { ImportHandler } from './lib/imports.js';
import { createPropertyAccess } from './lib/utils.js';

export function generateModule(entity) {
    const moduleName = entity.getModuleName();

    const importHandler = new ImportHandler();
    importHandler
        .addImport({ fields: ['Module'], module: '@nestjs/common' })
        .addImport({ fields: ['TypeOrmModule'], module: '@nestjs/typeorm' })
        .addImport({ fields: [entity.getControllerName()], module: `../controller/${entity.getControllerName()}` })
        .addImport({ fields: [entity.getServiceName()], module: `../service/${entity.getServiceName()}` })
        .addImport({ fields: [entity.getEntityName()], module: `../entity/${entity.getEntityName()}` });

    const moduleAnnotation = createModuleAnnotation({
        imports: [
            ts.factory.createCallExpression(
                createPropertyAccess('TypeOrmModule.forFeature'),
                undefined,
                [ts.factory.createArrayLiteralExpression([ts.factory.createIdentifier(entity.getEntityName())])]
            )
        ],
        controllers: [ts.factory.createIdentifier(entity.getControllerName())],
        providers: [ts.factory.createIdentifier(entity.getServiceName())]
    });

    const classNode = ts.factory.createClassDeclaration(
        [moduleAnnotation],
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        moduleName,
        undefined,
        undefined,
        []
    );

    return {
        name: moduleName,
        node: ts.factory.createSourceFile([...importHandler.buildImports(), classNode]),
        type: 'module'
    };
}
