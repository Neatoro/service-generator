import { EntityController } from './controller/entityController.js';

export function generateController(entity) {
  const entityController = new EntityController({ entity });
  return {
    name: entityController.name,
    node: entityController.buildSourceFile(),
    type: entityController.type
  };
}
