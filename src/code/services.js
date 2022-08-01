import ts from 'typescript';
import { ImportHandler } from './lib/imports.js';

export function generateService(entity) {
    const serviceName = `${entity.name}Service`;

    const importHandler = new ImportHandler();
    importHandler
        .addImport({ fields: ['Injectable'], module: '@nestjs/common' })
        .addImport({ fields: ['InjectRepository'], module: '@nestjs/typeorm' })
        .addImport({ fields: ['Repository'], module: 'typeorm' })
        .addImport({ fields: [entity.name], module: `../entity/${entity.name}` })
        .addImport({ fields: [`${entity.name}Dto`], module: `../interface/${entity.name}Interface` });

    const injectableAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Injectable'))
    );

    const classNode = ts.factory.createClassDeclaration(
        [injectableAnnotation],
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        serviceName,
        undefined,
        [],
        [
            generateServiceConstructor(entity),
            generateListFunction(entity),
            generateGetFunction(entity),
            generateSaveFunction(entity),
            generateRemoveFunction()
        ]
    );

    const block = ts.factory.createSourceFile([
        ...importHandler.buildImports(),
        classNode
    ]);

    return {
        name: serviceName,
        node: block,
        type: 'service'
    };
}

function generateServiceConstructor(entity) {
    const repositoryAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(
            ts.factory.createIdentifier('InjectRepository'),
            undefined,
            [ts.factory.createIdentifier(entity.name)]
        )
    );

    const repository = ts.factory.createParameterDeclaration(
        [repositoryAnnotation],
        [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
        undefined,
        'repository',
        undefined,
        ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Repository'), [ts.factory.createIdentifier(entity.name)]),
        undefined
    )

    const constructor = ts.factory.createConstructorDeclaration(undefined, undefined, [repository], ts.factory.createBlock());
    return constructor;
}

function generateListFunction(entity) {
    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('repository')),
                ts.factory.createIdentifier('find')
            ),
            undefined,
            undefined
        )
    );
    const block = ts.factory.createBlock([returnStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createArrayTypeNode(ts.factory.createIdentifier(entity.name))]);

    const listFunction = ts.factory.createMethodDeclaration(undefined, undefined, undefined, 'list', undefined, undefined, [], returnType, block);
    return listFunction;
}

function generateGetFunction(entity) {
    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('repository')),
                ts.factory.createIdentifier('findOneBy')
            ),
            undefined,
            [
                ts.factory.createObjectLiteralExpression([ts.factory.createIdentifier('id')])
            ]
        )
    );
    const block = ts.factory.createBlock([returnStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createIdentifier(entity.name)]);

    const getFunction = ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        'get',
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                'id',
                undefined,
                ts.factory.createTypeReferenceNode('string'),
                undefined
            )
        ],
        returnType,
        block
    );

    return getFunction;
}

function generateSaveFunction(entity) {
    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('repository')),
                ts.factory.createIdentifier('save')
            ),
            undefined,
            [
                ts.factory.createIdentifier('dto')
            ]
        )
    );

    const block = ts.factory.createBlock([returnStatement]);

    const dtoParameter = ts.factory.createParameterDeclaration(undefined, undefined, undefined, 'dto', undefined, ts.factory.createTypeReferenceNode(`${entity.name}Dto`), undefined);
    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createIdentifier(entity.name)]);

    const saveFunction = ts.factory.createMethodDeclaration(undefined, undefined, undefined, 'save', undefined, undefined, [dtoParameter], returnType, block);
    return saveFunction;
}

function generateRemoveFunction() {
    const awaitStatement = ts.factory.createAwaitExpression(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('repository')),
                ts.factory.createIdentifier('delete')
            ),
            undefined,
            [
                ts.factory.createIdentifier('id')
            ]
        )
    );
    const block = ts.factory.createBlock([awaitStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createTypeReferenceNode('void')]);

    const removeFunction = ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
        undefined,
        'remove',
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                'id',
                undefined,
                ts.factory.createTypeReferenceNode('string'),
                undefined
            )
        ],
        returnType,
        block
    );

    return removeFunction;
}
