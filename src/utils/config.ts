import Store from 'electron-store';

export default class Config {
  private readonly store = new Store();
  
  constructor() {
    this.store = new Store();
  }

  Set(key: string, value: any) {
    this.store.set(key, value);
  }

  Get<T>(key: string, defaultValue?: T): T {
    return this.store.get(key, defaultValue);
  }
}

