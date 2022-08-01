import ts from 'typescript';
import { ImportHandler } from './lib/imports.js';
import { createPropertyAccess } from './lib/utils.js';

export function generateController(entity) {
  const importHandler = new ImportHandler();
  importHandler
    .addImport({
      fields: ['Controller', 'Delete', 'Get', 'Param', 'Post', 'Body'],
      module: '@nestjs/common'
    })
    .addImport({
      fields: [entity.getServiceName()],
      module: `../service/${entity.getServiceName()}`
    })
    .addImport({
      fields: [entity.getEntityName()],
      module: `../entity/${entity.getEntityName()}`
    })
    .addImport({
      fields: [entity.getDtoName()],
      module: `../interface/${entity.getInterfaceName()}`
    });

  const controllerAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Controller'),
      undefined,
      [
        ts.factory.createStringLiteral(
          entity.getEntityName().toLowerCase(),
          true
        )
      ]
    )
  );

  const classNode = ts.factory.createClassDeclaration(
    [controllerAnnotation],
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    entity.getControllerName(),
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
    name: entity.getControllerName(),
    node: ts.factory.createSourceFile([
      ...importHandler.buildImports(),
      classNode
    ]),
    type: 'controller'
  };
}

function generateContructor(entity) {
  const service = ts.factory.createParameterDeclaration(
    undefined,
    [
      ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
      ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
    ],
    undefined,
    'service',
    undefined,
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(entity.getServiceName())
    ),
    undefined
  );

  const constructor = ts.factory.createConstructorDeclaration(
    undefined,
    undefined,
    [service],
    ts.factory.createBlock()
  );
  return constructor;
}

function generateListFunction(entity) {
  const getAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Get'),
      undefined,
      []
    )
  );

  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.service.list'),
      undefined,
      undefined
    )
  );
  const block = ts.factory.createBlock([returnStatement]);

  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createArrayTypeNode(
      ts.factory.createIdentifier(entity.getEntityName())
    )
  ]);

  const listFunction = ts.factory.createMethodDeclaration(
    [getAnnotation],
    undefined,
    undefined,
    'list',
    undefined,
    undefined,
    [],
    returnType,
    block
  );
  return listFunction;
}

function generateGetFunction(entity) {
  const getAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Get'),
      undefined,
      [ts.factory.createStringLiteral(':id', true)]
    )
  );
  const paramAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Param'),
      undefined,
      [ts.factory.createStringLiteral('id', true)]
    )
  );

  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.service.get'),
      undefined,
      [ts.factory.createIdentifier('id')]
    )
  );
  const block = ts.factory.createBlock([returnStatement]);

  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createIdentifier(entity.getEntityName())
  ]);

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
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Post'),
      undefined,
      []
    )
  );

  const bodyAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Body'),
      undefined,
      []
    )
  );

  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.service.save'),
      undefined,
      [ts.factory.createIdentifier('dto')]
    )
  );

  const block = ts.factory.createBlock([returnStatement]);

  const dtoParameter = ts.factory.createParameterDeclaration(
    [bodyAnnotation],
    undefined,
    undefined,
    'dto',
    undefined,
    ts.factory.createTypeReferenceNode(entity.getDtoName()),
    undefined
  );
  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createIdentifier(entity.getEntityName())
  ]);

  const saveFunction = ts.factory.createMethodDeclaration(
    [postAnnotation],
    undefined,
    undefined,
    'save',
    undefined,
    undefined,
    [dtoParameter],
    returnType,
    block
  );
  return saveFunction;
}

function generateRemoveFunction() {
  const deleteAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Delete'),
      undefined,
      [ts.factory.createStringLiteral(':id', true)]
    )
  );
  const paramAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Param'),
      undefined,
      [ts.factory.createStringLiteral('id', true)]
    )
  );

  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.service.remove'),
      undefined,
      [ts.factory.createIdentifier('id')]
    )
  );
  const block = ts.factory.createBlock([returnStatement]);

  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createIdentifier('void')
  ]);

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
