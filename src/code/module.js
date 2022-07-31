import ts from 'typescript';

export function generateModule(entity) {
    const moduleName = `${entity.name}Module`;

    const nestjsCommonImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [
                ts.factory.createIdentifier('Module')
            ]
        ),
        ts.factory.createStringLiteral('@nestjs/common', true)
    );

    const nestjsTypeORMImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier('TypeOrmModule')]
        ),
        ts.factory.createStringLiteral('@nestjs/typeorm', true)
    );

    const controllerImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(`${entity.name}Controller`)]
        ),
        ts.factory.createStringLiteral(`../controller/${entity.name}Controller`, true)
    );


    const serviceImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(`${entity.name}Service`)]
        ),
        ts.factory.createStringLiteral(`../service/${entity.name}Service`, true)
    );

    const entityImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(entity.name)]
        ),
        ts.factory.createStringLiteral(`../entity/${entity.name}`, true)
    );

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
        node: ts.factory.createSourceFile([nestjsCommonImport, nestjsTypeORMImport, controllerImport, serviceImport, entityImport, classNode]),
        type: 'module'
    };
}
