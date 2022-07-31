import ts from 'typescript';

export function generateController(entity) {
    const controllerName = `${entity.name}Controller`;

    const nestjsCommonImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [
                ts.factory.createIdentifier('Controller'),
                ts.factory.createIdentifier('Delete'),
                ts.factory.createIdentifier('Get'),
                ts.factory.createIdentifier('Param'),
                ts.factory.createIdentifier('Post'),
                ts.factory.createIdentifier('Body')
            ]
        ),
        ts.factory.createStringLiteral('@nestjs/common', true)
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

    const interfaceImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier(`${entity.name}Dto`)]
        ),
        ts.factory.createStringLiteral(`../interface/${entity.name}Interface`, true)
    );

    const controllerAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Controller'), undefined, [ts.factory.createStringLiteral(entity.name.toLowerCase(), true)])
    );

    const classNode = ts.factory.createClassDeclaration(
        [controllerAnnotation],
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        controllerName,
        undefined,
        undefined,
        [
            generateContructor(entity),
            generateListFunction(entity),
            generateGetFunction(entity),
            generateSaveFunction(entity),
            generateRemoveFunction()
        ]
    );

    return {
        name: controllerName,
        node: ts.factory.createSourceFile([nestjsCommonImport, serviceImport, entityImport, interfaceImport, classNode]),
        type: 'controller'
    };
}

function generateContructor(entity) {
    const service = ts.factory.createParameterDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword), ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
        undefined,
        'service',
        undefined,
        ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(`${entity.name}Service`)),
        undefined
    )

    const constructor = ts.factory.createConstructorDeclaration(undefined, undefined, [service], ts.factory.createBlock());
    return constructor;
}

function generateListFunction(entity) {
    const getAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Get'), undefined, [])
    );

    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('service')),
                ts.factory.createIdentifier('list')
            ),
            undefined,
            undefined
        )
    );
    const block = ts.factory.createBlock([returnStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createArrayTypeNode(ts.factory.createIdentifier(entity.name))]);

    const listFunction = ts.factory.createMethodDeclaration([getAnnotation], undefined, undefined, 'list', undefined, undefined, [], returnType, block);
    return listFunction;
}

function generateGetFunction(entity) {
    const getAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Get'), undefined, [ts.factory.createStringLiteral(':id', true)])
    );
    const paramAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Param'), undefined, [ts.factory.createStringLiteral('id', true)])
    );

    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('service')),
                ts.factory.createIdentifier('get')
            ),
            undefined,
            [
                ts.factory.createIdentifier('id')
            ]
        )
    );
    const block = ts.factory.createBlock([returnStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createIdentifier(entity.name)]);

    const getFunction = ts.factory.createMethodDeclaration(
        [getAnnotation],
        undefined,
        undefined,
        'get',
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                [paramAnnotation],
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
    const postAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Post'), undefined, [])
    );

    const bodyAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Body'), undefined, [])
    );

    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('service')),
                ts.factory.createIdentifier('save')
            ),
            undefined,
            [
                ts.factory.createIdentifier('dto')
            ]
        )
    );

    const block = ts.factory.createBlock([returnStatement]);

    const dtoParameter = ts.factory.createParameterDeclaration([bodyAnnotation], undefined, undefined, 'dto', undefined, ts.factory.createTypeReferenceNode(`${entity.name}Dto`), undefined);
    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createIdentifier(entity.name)]);

    const saveFunction = ts.factory.createMethodDeclaration([postAnnotation], undefined, undefined, 'save', undefined, undefined, [dtoParameter], returnType, block);
    return saveFunction;
}

function generateRemoveFunction() {
    const deleteAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Delete'), undefined, [ts.factory.createStringLiteral(':id', true)])
    );
    const paramAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Param'), undefined, [ts.factory.createStringLiteral('id', true)])
    );

    const returnStatement = ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('service')),
                ts.factory.createIdentifier('remove')
            ),
            undefined,
            [
                ts.factory.createIdentifier('id')
            ]
        )
    );
    const block = ts.factory.createBlock([returnStatement]);

    const returnType = ts.factory.createTypeReferenceNode('Promise', [ts.factory.createIdentifier('void')]);

    const removeFunction = ts.factory.createMethodDeclaration(
        [deleteAnnotation],
        undefined,
        undefined,
        'remove',
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                [paramAnnotation],
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
