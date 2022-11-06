// single model methods
import knex from '@db';
import { IUser } from '@interfaces/User.interface';
import { IWallet } from '@interfaces/Wallet.interface';

export default abstract class Repository<T extends IUser | IWallet> {
  protected abstract model: 'users' | 'wallets';
  protected db = knex;

  protected seralizeId(id: number | object) {
    if (typeof id === 'number') return { id };
    return id;
  }
  async find() {
    const result = <T[]>JSON.parse(JSON.stringify(await knex.select().from<T>(this.model)));
    return result;
  }

  async findOne(data: number | Partial<T>) {
    const query = this.seralizeId(data);
    const result = <T>(
      JSON.parse(JSON.stringify(await knex.select().from<T>(this.model).where(query)))[0]
    );
    return result;
  }

  async update(_query: number | Partial<T>, data: Partial<T>) {
    const query = this.seralizeId(_query);
    await knex<T>(this.model)
      .where(query)
      .update(<any>data);
    return this.findOne(data);
  }

  async create(data: Partial<T>) {
    const result = await knex<T>(this.model).insert(<any>data);
    return this.findOne(result[0]);
  }

  async delete(data: number | Partial<T>) {
    const query = this.seralizeId(data);
    await knex<T>(this.model).where(query).del();
    return this.findOne(data);
  }
}
