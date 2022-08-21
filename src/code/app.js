import { AppModule } from './modules/appModule.js';

export function generateAppModule(entities) {
  const appModule = new AppModule({ entities });
  return {
    name: appModule.name,
    node: appModule.buildSourceFile(),
    type: appModule.type
  };
}
