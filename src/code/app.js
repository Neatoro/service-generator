import ts from 'typescript';

export function generateAppModule(entities) {
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

    const modulesLiterals = entities.map((entity) => ts.factory.createIdentifier(`${entity.name}Module`));
    const moduleImports = entities.map((entity) => ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(`${entity.name}Module`)]
        ),
        ts.factory.createStringLiteral(`../module/${entity.name}Module`, true)
    ))

    const moduleAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Module'), undefined, [
            ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment('imports', ts.factory.createArrayLiteralExpression([
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('TypeOrmModule'), 'forRoot'),
                        undefined,
                        []
                    ),
                    ...modulesLiterals
                ]))
            ])
        ])
    );

    const classNode = ts.factory.createClassDeclaration(
        [moduleAnnotation],
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        'AppModule',
        undefined,
        undefined,
        []
    );

    return {
        name: 'AppModule',
        node: ts.factory.createSourceFile([nestjsCommonImport, nestjsTypeORMImport, ...moduleImports, classNode]),
        type: 'app'
    };
}
