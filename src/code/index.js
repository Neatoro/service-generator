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
    const typeOrmImport = ts.factory.createImportDeclaration(
        undefined,
        undefined,
        ts.factory.createObjectLiteralExpression(
            [ts.factory.createIdentifier('Entity'), ts.factory.createIdentifier('Column'), ts.factory.createIdentifier('PrimaryGeneratedColumn')]
        ),
        ts.factory.createIdentifier('typeorm')
    );

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

    const classNode = ts.factory.createClassDeclaration([entityAnnotation], undefined, entity.name, undefined, [], [idProperty, ...properties]);

    const block = ts.factory.createSourceFile([typeOrmImport, classNode]);
    return {
        name: entity.name,
        node: block
    };
}
