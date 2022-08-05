import ts from 'typescript';
import { ImportHandler } from './imports.js';

export class Source extends ImportHandler {
  constructor({ name, type }) {
    super();
    this.name = name;
    this.type = type;
  }

  createSourceFile(statements) {
    return ts.factory.createSourceFile(statements);
  }

  buildSourceFile() {
    throw new Error(
      'Source.buildSourceFile needs to be implemented in child class'
    );
  }
}
