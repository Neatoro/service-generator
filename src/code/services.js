import ts from 'typescript';
import { ImportHandler } from './lib/imports.js';
import { createPropertyAccess } from './lib/utils.js';

export function generateService(entity) {
  const importHandler = new ImportHandler();
  importHandler
    .addImport({ fields: ['Injectable'], module: '@nestjs/common' })
    .addImport({ fields: ['InjectRepository'], module: '@nestjs/typeorm' })
    .addImport({ fields: ['Repository'], module: 'typeorm' })
    .addImport({
      fields: [entity.getEntityName()],
      module: `../entity/${entity.getEntityName()}`
    })
    .addImport({
      fields: [entity.getDtoName()],
      module: `../interface/${entity.getInterfaceName()}`
    });

  const injectableAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(ts.factory.createIdentifier('Injectable'))
  );

  const classNode = ts.factory.createClassDeclaration(
    [injectableAnnotation],
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    entity.getServiceName(),
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
    name: entity.getServiceName(),
    node: block,
    type: 'service'
  };
}

function generateServiceConstructor(entity) {
  const repositoryAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('InjectRepository'),
      undefined,
      [ts.factory.createIdentifier(entity.getEntityName())]
    )
  );

  const repository = ts.factory.createParameterDeclaration(
    [repositoryAnnotation],
    [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
    undefined,
    'repository',
    undefined,
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Repository'),
      [ts.factory.createIdentifier(entity.getEntityName())]
    ),
    undefined
  );

  const constructor = ts.factory.createConstructorDeclaration(
    undefined,
    undefined,
    [repository],
    ts.factory.createBlock()
  );
  return constructor;
}

function generateListFunction(entity) {
  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.repository.find'),
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
    undefined,
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
  const returnStatement = ts.factory.createReturnStatement(
    ts.factory.createCallExpression(
      createPropertyAccess('this.repository.findOneBy'),
      undefined,
      [
        ts.factory.createObjectLiteralExpression([
          ts.factory.createIdentifier('id')
        ])
      ]
    )
  );
  const block = ts.factory.createBlock([returnStatement]);

  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createIdentifier(entity.getEntityName())
  ]);

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
      createPropertyAccess('this.repository.save'),
      undefined,
      [ts.factory.createIdentifier('dto')]
    )
  );

  const block = ts.factory.createBlock([returnStatement]);

  const dtoParameter = ts.factory.createParameterDeclaration(
    undefined,
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
    undefined,
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
  const awaitStatement = ts.factory.createAwaitExpression(
    ts.factory.createCallExpression(
      createPropertyAccess('this.repository.delete'),
      undefined,
      [ts.factory.createIdentifier('id')]
    )
  );
  const block = ts.factory.createBlock([awaitStatement]);

  const returnType = ts.factory.createTypeReferenceNode('Promise', [
    ts.factory.createTypeReferenceNode('void')
  ]);

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
