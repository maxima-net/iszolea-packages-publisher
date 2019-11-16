import Cryptr from 'cryptr';

export default class EncryptionService {
  private readonly KEY = 'iszolea-packages-publisher';

  encrypt(value: string): string {
    const cryptr = new Cryptr(this.KEY);
    return cryptr.encrypt(value);
  }
  
  decrypt(value: string): string {
    try {
      const cryptr = new Cryptr(this.KEY);
      return cryptr.decrypt(value);
    }
    catch {
      return '';
    }
  }
}
