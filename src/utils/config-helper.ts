import Store from 'electron-store';

class ConfigHelper {
  static Set(key: string, value: any) {
    const store = new Store();
    store.set(key, value);
  }

  static Get<T>(key: string, defaultValue?: T): T {
    const store = new Store();
    return store.get(key, defaultValue);
  }
}

export default ConfigHelper

