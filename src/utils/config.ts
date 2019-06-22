import Store from 'electron-store';

export function Set(key: string, value: any) {
  const store = new Store();
  store.set(key, value);
}

export function Get<T>(key: string, defaultValue?: T): T {
  const store = new Store();
  return store.get(key, defaultValue);
}

