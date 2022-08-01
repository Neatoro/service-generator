import ts from 'typescript';
import { ImportHandler } from './lib/imports.js';

export function generateModule(entity) {
    const moduleName = `${entity.name}Module`;

    const importHandler = new ImportHandler();
    importHandler
        .addImport({ fields: ['Module'], module: '@nestjs/common' })
        .addImport({ fields: ['TypeOrmModule'], module: '@nestjs/typeorm' })
        .addImport({ fields: [`${entity.name}Controller`], module: `../controller/${entity.name}Controller` })
        .addImport({ fields: [`${entity.name}Service`], module: `../service/${entity.name}Service` })
        .addImport({ fields: [entity.name], module: `../entity/${entity.name}` });

    const moduleAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Module'), undefined, [
            ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment('imports', ts.factory.createArrayLiteralExpression([
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('TypeOrmModule'), 'forFeature'),
                        undefined,
                        [ts.factory.createArrayLiteralExpression([ts.factory.createIdentifier(entity.name)])]
                    )
                ])),
                ts.factory.createPropertyAssignment('controllers', ts.factory.createArrayLiteralExpression([ts.factory.createIdentifier(`${entity.name}Controller`)])),
                ts.factory.createPropertyAssignment('providers', ts.factory.createArrayLiteralExpression([ts.factory.createIdentifier(`${entity.name}Service`)]))
            ])
        ])
    );

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
