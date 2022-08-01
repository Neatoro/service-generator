import ts from 'typescript';

export function generateInterfaces(entity) {
    return {
        name: entity.getInterfaceName(),
        node: ts.factory.createSourceFile([
            generateDto(entity)
        ]),
        type: 'interface'
    };
};

function generateDto(entity) {
    const properties = entity.properties.map((property) => {
        return ts.factory.createPropertyDeclaration(undefined, undefined, property.name, undefined, ts.factory.createTypeReferenceNode(property.type), undefined);    });

    const interfaceNode = ts.factory.createInterfaceDeclaration(undefined, [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], entity.getDtoName(), undefined, [], properties);
    return interfaceNode;
}
