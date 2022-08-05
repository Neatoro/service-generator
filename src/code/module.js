import { EntityModule } from './modules/entityModule.js';

export function generateModule(entity) {
  const entityModule = new EntityModule({ entity });

  return {
    name: entityModule.name,
    node: entityModule.buildSourceFile(),
    type: entityModule.type
  };
}
