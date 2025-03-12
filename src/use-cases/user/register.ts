import { IUseCase, IValidator } from "../../interfaces";
import { IUserDAO } from "../../interfaces/user";
import { User } from "../../entities";
import { ValidationError } from "../../errors";

export default class RegisterUser implements IUseCase<User> {
  constructor (
    protected validator: IValidator<User>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (password: string) => Promise<{ password: string; salt: string }>
  ) {}

  async call (payload: Partial<User>): Promise<User> {
    const { data, errors } = this.validator.validate(payload)
    if (errors && errors.length > 0) {
      console.error(errors)
      throw new ValidationError("The data is invalid", errors)
    }

    const { password, salt } = await this.encryptPassword(data.password)
    Object.assign(data, {
      role: 'user',
      password,
      salt,
    })

    return this.userDAO.create(data)
  }
}
