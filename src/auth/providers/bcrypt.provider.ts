import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(data, salt);
    return encryptedPassword;
  }

  public async comparePassword(
    data: string | Buffer,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encryptedPassword);
  }
}
