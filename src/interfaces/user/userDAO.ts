import { User } from "../../entities";

export default interface IUserDAO {
  findOneBy(filters: Partial<User>): Promise<User>
  create(payload: Partial<User>): Promise<User>
}
