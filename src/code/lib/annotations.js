import ts from 'typescript';

export function createModuleAnnotation({ imports = [], controllers = [], providers = [] }) {
    const moduleAnnotation = ts.factory.createDecorator(
        ts.factory.createCallExpression(ts.factory.createIdentifier('Module'), undefined, [
            ts.factory.createObjectLiteralExpression([
                ts.factory.createPropertyAssignment('imports', ts.factory.createArrayLiteralExpression(imports)),
                ts.factory.createPropertyAssignment('controllers', ts.factory.createArrayLiteralExpression(controllers)),
                ts.factory.createPropertyAssignment('providers', ts.factory.createArrayLiteralExpression(providers))
            ])
        ])
    );

    return moduleAnnotation;
};
