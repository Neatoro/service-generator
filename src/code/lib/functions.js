import ts from 'typescript';
import { createPropertyAccess } from './utils.js';

export function createFunctionCall({ id, parameters }) {
  return ts.factory.createCallExpression(
    createPropertyAccess(id),
    undefined,
    parameters
  );
}

export function createMethod({
  name,
  statements,
  annotations,
  parameters = [],
  returnType
}) {
  const block = ts.factory.createBlock(statements);
  return ts.factory.createMethodDeclaration(
    annotations,
    undefined,
    undefined,
    name,
    undefined,
    undefined,
    parameters,
    returnType,
    block
  );
}

export function returnValue({ value }) {
  return ts.factory.createReturnStatement(value);
}
