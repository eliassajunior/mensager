import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, await bcrypt.genSalt());
  }
  async compare(data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
