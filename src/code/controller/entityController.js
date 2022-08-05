import {
    bodyAnnotation,
    deleteAnnotation,
  getAnnotation,
  idParamAnnotation,
  listAnnotation,
  postAnnotation
} from '../lib/annotations.js';
import {
  createFunctionCall,
  createMethod,
  returnValue
} from '../lib/functions.js';
import { Source } from '../lib/source.js';
import {
  createEntityArrayPromiseType,
  createEntityPromiseType,
  createPropertyAccess
} from '../lib/utils.js';
import ts from 'typescript';

export class EntityController extends Source {
  constructor({ entity }) {
    super({ name: entity.getControllerName(), type: 'controller' });
    this._entity = entity;

    this._addImports();
    this._controllerAnnotation = ts.factory.createDecorator(
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
  }

  _addImports() {
    this.addImport({
      fields: ['Controller', 'Delete', 'Get', 'Param', 'Post', 'Body'],
      module: '@nestjs/common'
    })
      .addImport({
        fields: [this._entity.getServiceName()],
        module: `../service/${this._entity.getServiceName()}`
      })
      .addImport({
        fields: [this._entity.getEntityName()],
        module: `../entity/${this._entity.getEntityName()}`
      })
      .addImport({
        fields: [this._entity.getDtoName()],
        module: `../interface/${this._entity.getInterfaceName()}`
      });
  }

  _createContructor() {
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
        ts.factory.createIdentifier(this._entity.getServiceName())
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

  _createListFunction() {
    return createMethod({
      name: 'list',
      returnType: createEntityArrayPromiseType({ entity: this._entity }),
      annotations: [listAnnotation],
      statements: [
        returnValue({
          value: createFunctionCall({
            id: 'this.service.list'
          })
        })
      ]
    });
  }

  _createGetFunction() {
    return createMethod({
      name: 'get',
      returnType: createEntityPromiseType({ entity: this._entity }),
      annotations: [getAnnotation],
      parameters: [
        ts.factory.createParameterDeclaration(
          [idParamAnnotation],
          undefined,
          undefined,
          'id',
          undefined,
          ts.factory.createTypeReferenceNode('string'),
          undefined
        )
      ],
      statements: [
        returnValue({
          value: createFunctionCall({
            id: 'this.service.get',
            parameters: [createPropertyAccess('id')]
          })
        })
      ]
    });
  }

  _createSaveFunction() {
    return createMethod({
      name: 'save',
      returnType: createEntityPromiseType({ entity: this._entity }),
      annotations: [postAnnotation],
      parameters: [
        ts.factory.createParameterDeclaration(
          [bodyAnnotation],
          undefined,
          undefined,
          'dto',
          undefined,
          ts.factory.createTypeReferenceNode(this._entity.getDtoName()),
          undefined
        )
      ],
      statements: [
        returnValue({
          value: createFunctionCall({
            id: 'this.service.save',
            parameters: [createPropertyAccess('dto')]
          })
        })
      ]
    });
  }

  _createRemoveFunction() {
    return createMethod({
      name: 'remove',
      returnType: ts.factory.createTypeReferenceNode('Promise', [
        ts.factory.createIdentifier('void')
      ]),
      annotations: [deleteAnnotation],
      parameters: [
        ts.factory.createParameterDeclaration(
          [idParamAnnotation],
          undefined,
          undefined,
          'id',
          undefined,
          ts.factory.createTypeReferenceNode('string'),
          undefined
        )
      ],
      statements: [
        returnValue({
          value: createFunctionCall({
            id: 'this.service.remove',
            parameters: [createPropertyAccess('id')]
          })
        })
      ]
    });
  }

  buildSourceFile() {
    const classNode = ts.factory.createClassDeclaration(
      [this._controllerAnnotation],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.name,
      undefined,
      undefined,
      [
        this._createContructor(),
        this._createListFunction(),
        this._createGetFunction(),
        this._createSaveFunction(),
        this._createRemoveFunction()
      ]
    );

    return this.createSourceFile([...this.buildImports(), classNode]);
  }
}
