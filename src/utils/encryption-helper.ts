import Cryptr from 'cryptr';
const key = 'iszolea-packages-publisher';

export function encrypt(value: string): string {
  const cryptr = new Cryptr(key);
  return cryptr.encrypt(value);
}

export function decrypt(value: string): string {
  try {
    const cryptr = new Cryptr(key);
    return cryptr.decrypt(value);
  }
  catch {
    return '';
  }
}
