export class Entity {
  constructor({ name, properties }) {
    this._name = name;
    this.properties = properties;
  }

  getEntityName() {
    return this._name;
  }

  getServiceName() {
    return `${this._name}Service`;
  }

  getControllerName() {
    return `${this._name}Controller`;
  }

  getModuleName() {
    return `${this._name}Module`;
  }

  getInterfaceName() {
    return `${this._name}Interface`;
  }

  getDtoName() {
    return `${this._name}Dto`;
  }
}
