import ts from 'typescript';

export function generateAppModule(entities) {
    const pathCommonImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [
                ts.factory.createIdentifier('resolve')
            ]
        ),
        ts.factory.createStringLiteral('path', true)
    );

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
                                ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('process'), 'cwd')
                            ),
                            ts.factory.createStringLiteral('ormconfig.json', true)
                        ]
                    )
                ]
            )
        )
    );

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
    ));

    const entitiesLiterals = entities.map((entity) => ts.factory.createIdentifier(entity.name));
    const entityImports = entities.map((entity) => ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(`${entity.name}`)]
        ),
        ts.factory.createStringLiteral(`../entity/${entity.name}`, true)
    ));
    const config = ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment('entities', ts.factory.createArrayLiteralExpression(entitiesLiterals)),
        ts.factory.createSpreadAssignment(ts.factory.createIdentifier('ormconfig'))
    ]);

    const moduleAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Module'), undefined, [
            ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment('imports', ts.factory.createArrayLiteralExpression([
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('TypeOrmModule'), 'forRoot'),
                        undefined,
                        [config]
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
        node: ts.factory.createSourceFile([pathCommonImport, nestjsCommonImport, nestjsTypeORMImport, ...moduleImports, ...entityImports, ormConfig, classNode]),
        type: 'app'
    };
}
