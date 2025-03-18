import { AuthUser } from '../../entities'
import { ValidationError } from '../../errors'
import { IUseCase, IValidator } from '../../interfaces'
import { IUserDAO } from '../../interfaces/user'

type UserPayload = Pick<
  AuthUser,
  'email' | 'firstName' | 'lastName' | 'password' | 'confirmPassword'
>
type AdminPayload = UserPayload & { role: 'admin' | 'user' }

export default class UpdateUser implements IUseCase<boolean> {
  constructor(
    protected validator: IValidator<UserPayload | AdminPayload>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (password: string) => Promise<{ password: string; salt: string }>,
  ) {}

  async call(id: number, payload: UserPayload | AdminPayload): Promise<boolean> {
    const { data, errors } = this.validator.validate(payload)
    if (errors && errors.length > 0) {
      throw new ValidationError('Data is invalid', errors)
    }

    if (data.password) {
      const { password, salt } = await this.encryptPassword(data.password)
      Object.assign(data, {
        password,
        salt,
      })
    } else {
      delete (data as Partial<UserPayload | AdminPayload>).password
    }
    delete (data as Partial<UserPayload | AdminPayload>).confirmPassword

    return this.userDAO.update(id, data)
  }
}
