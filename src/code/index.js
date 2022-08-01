import ts from 'typescript';
import { generateAppModule } from './app.js';
import { generateController } from './controller.js';
import { generateInterfaces } from './interface.js';
import { ImportHandler } from './lib/imports.js';
import { generateModule } from './module.js';
import { generateService } from './services.js';

export function printNode({ node, name, type }) {
    const fileName = `${name}.ts`;
    const file = ts.createSourceFile(fileName, '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const result = printer.printNode(ts.EmitHint.Unspecified, node, file);
    return {
        name: fileName,
        code: result,
        type
    };
}

export function generateCode({ definition }) {
    const entities = definition.entities.map((entity) => generateEntity(entity));
    const services = definition.entities.map((entity) => generateService(entity));
    const interfaces = definition.entities.map((entity) => generateInterfaces(entity));
    const controller = definition.entities.map((entity) => generateController(entity));
    const modules = definition.entities.map((entity) => generateModule(entity));
    return [
        ...entities,
        ...services,
        ...interfaces,
        ...controller,
        ...modules,
        generateAppModule(definition.entities)
    ];
};

function generateEntity(entity) {
    const importHandler = new ImportHandler();
    importHandler.addImport({ fields: ['Entity', 'PrimaryGeneratedColumn', 'Column'], module: 'typeorm' });

    const entityAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Entity'))
    );

    const idAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('PrimaryGeneratedColumn'), undefined, [ts.factory.createStringLiteral('uuid', true)])
    );
    const idProperty = ts.factory.createPropertyDeclaration([idAnnotation], undefined, 'id', undefined, ts.factory.createTypeReferenceNode('string'), undefined);

    const properties = entity.properties.map((property) => {
        const columnAnnotation = ts.factory.createDecorator(
            ts.factory.createCallExpression(ts.factory.createIdentifier('Column'))
        );

        return ts.factory.createPropertyDeclaration([columnAnnotation], undefined, property.name, undefined, ts.factory.createTypeReferenceNode(property.type), undefined);    });

    const classNode = ts.factory.createClassDeclaration([entityAnnotation], [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], entity.name, undefined, [], [idProperty, ...properties]);

    const block = ts.factory.createSourceFile([...importHandler.buildImports(), classNode]);
    return {
        name: entity.name,
        node: block,
        type: 'entity'
    };
}
