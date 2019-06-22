import Cryptr from 'cryptr';

const KEY = 'iszolea-packages-publisher';

export function encrypt(value: string): string {
  const cryptr = new Cryptr(KEY);
  return cryptr.encrypt(value);
}

export function decrypt(value: string): string {
  try {
    const cryptr = new Cryptr(KEY);
    return cryptr.decrypt(value);
  }
  catch {
    return '';
  }
}
