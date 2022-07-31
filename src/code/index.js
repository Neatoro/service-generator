import ts from 'typescript';

export function printNode({ node, name }) {
    const file = ts.createSourceFile(`${name}.ts`, '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const result = printer.printNode(ts.EmitHint.Unspecified, node, file);
    console.log(result);
}

export function generateCode({ definition }) {
    const entityNodes = definition.entities.map((entity) => generateEntity(entity));
    return {
        entities: entityNodes
    };
};

function generateEntity(entity) {
    const properties = entity.properties.map((property) => {
        return ts.factory.createPropertyDeclaration(undefined, undefined, property.name, undefined, ts.factory.createTypeReferenceNode(property.type), undefined);
    });

    const classNode = ts.factory.createClassDeclaration(undefined, undefined, entity.name, undefined, [], properties);
    return {
        name: entity.name,
        node: classNode
    };
}
