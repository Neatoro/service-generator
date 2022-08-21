import ts from 'typescript';
import { Source } from '../lib/source.js';
import {
  columnAnnotation,
  entityAnnotation,
  idAnnotation
} from '../lib/annotations.js';

export class DatabaseEntity extends Source {
  constructor({ entity }) {
    super({ name: entity.getEntityName(), type: 'entity' });
    this._entity = entity;
    this._addImports();
  }

  _addImports() {
    this.addImport({
      fields: ['Entity', 'PrimaryGeneratedColumn', 'Column'],
      module: 'typeorm'
    });
  }

  _createProperties() {
    const idProperty = ts.factory.createPropertyDeclaration(
      [idAnnotation],
      undefined,
      'id',
      undefined,
      ts.factory.createTypeReferenceNode('string'),
      undefined
    );

    const properties = this._entity.properties.map((property) =>
      ts.factory.createPropertyDeclaration(
        [columnAnnotation],
        undefined,
        property.name,
        undefined,
        ts.factory.createTypeReferenceNode(property.type),
        undefined
      )
    );

    return [idProperty, ...properties];
  }

  buildSourceFile() {
    const classNode = ts.factory.createClassDeclaration(
      [entityAnnotation],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      this._entity.getEntityName(),
      undefined,
      [],
      this._createProperties()
    );

    return ts.factory.createSourceFile([...this.buildImports(), classNode]);
  }
}
