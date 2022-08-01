import ts from 'typescript';

export function createPropertyAccess(path = '') {
    return path
        .split('.')
        .reduce(
            (acc, part) => {
                if (!acc) {
                    return createThisOrIdentifier(part);
                } else {
                    return ts.factory.createPropertyAccessExpression(acc, part);
                }
            },
            undefined
        );
}

function createThisOrIdentifier(part) {
    return part === 'this' ? ts.factory.createThis() : ts.factory.createIdentifier(part);
}
