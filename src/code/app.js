import ts from 'typescript';
import { ImportHandler } from './lib/imports.js';

export function generateAppModule(entities) {
    const importHandler = new ImportHandler();
    importHandler
        .addImport({ fields: ['resolve'], module: 'path' })
        .addImport({ fields: ['Module'], module: '@nestjs/common' })
        .addImport({ fields: ['TypeOrmModule'], module: '@nestjs/typeorm' });

    entities.forEach((entity) => importHandler.addImport({ fields: [entity.getModuleName()], module: `../module/${entity.getModuleName()}` }));
    entities.forEach((entity) => importHandler.addImport({ fields: [entity.getEntityName()], module: `../entity/${entity.getEntityName()}` }));

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

    const modulesLiterals = entities.map((entity) => ts.factory.createIdentifier(entity.getModuleName()));
    const entitiesLiterals = entities.map((entity) => ts.factory.createIdentifier(entity.getEntityName()));

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
        node: ts.factory.createSourceFile([...importHandler.buildImports(), ormConfig, classNode]),
        type: 'app'
    };
}
