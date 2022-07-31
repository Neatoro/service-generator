import { createRequire } from 'module';

const typeMap = {
    string: 'string',
    integer: 'number'
};

const require = createRequire(import.meta.url);

export function loadValidSchema({ path }) {
    const schema = require(path);
    if (schema.type !== 'object') {
        throw 'Currently there is only support for objects as root level type';
    }

    if (!schema.title) {
        throw 'A title is required on root level entity';
    }

    return schema;
};

export function transformSchema({ schema }) {
    const properties = Object.keys(schema.properties);

    const entity = {
        name: schema.title,
        properties: properties.map((property) => ({
            name: property,
            type: typeMap[schema.properties[property].type]
        }))
    };

    return {
        entities: [entity]
    };
}
