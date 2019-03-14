import Store from 'electron-store';

class ConfigHelper {
  static Set(key: string, value: any) {
    const store = new Store();
    store.set(key, value);
  }

  static Get<T>(key: string): T {
    const store = new Store();
    return store.get(key);
  }
}

export default ConfigHelper

