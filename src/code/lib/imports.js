import ts from 'typescript';

export class ImportHandler {

    constructor() {
        this._imports = {};
    }

    addImport({ module, fields }) {
        const currentImports = this._imports[module] || [];
        this._imports[module] = [
            ...currentImports,
            ...fields
        ]
        return this;
    }

    buildImports() {
        const modules = Object.keys(this._imports);
        return modules.map((module) => ts.factory.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createObjectLiteralExpression(
                this._imports[module].map((field) => ts.factory.createIdentifier(field))
            ),
            ts.factory.createStringLiteral(module, true)
        ));
    }

};
