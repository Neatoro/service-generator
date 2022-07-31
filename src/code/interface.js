import ts from 'typescript';

export function generateInterfaces(entity) {
    return {
        name: `${entity.name}Interface`,
        node: ts.factory.createSourceFile([
            generateDto(entity)
        ]),
        type: 'interface'
    };
};

function generateDto(entity) {
    const dtoName = `${entity.name}Dto`;

    const properties = entity.properties.map((property) => {
        return ts.factory.createPropertyDeclaration(undefined, undefined, property.name, undefined, ts.factory.createTypeReferenceNode(property.type), undefined);    });

    const interfaceNode = ts.factory.createInterfaceDeclaration(undefined, [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], dtoName, undefined, [], properties);
    return interfaceNode;
}
