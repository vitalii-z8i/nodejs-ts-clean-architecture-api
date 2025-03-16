import { User } from '../../entities'
import { UnauthorizedError, ValidationError } from '../../errors'
import { IUseCase } from '../../interfaces'
import { ILoginResponse, IUserDAO } from '../../interfaces/user'

export default class LoginUser implements IUseCase<ILoginResponse> {
  constructor(
    protected userDAO: IUserDAO,
    protected comparePasswords: (
      input: string,
      encrypted: string
    ) => Promise<boolean>,
    protected issueToken: (payload: Partial<User>) => string,
  ) {}

  async call(
    email: string,
    password: string,
  ): Promise<ILoginResponse> {
    if (!email || !password) {
      throw new ValidationError('Email and Password are required')
    }
    const user = await this.userDAO.findForAuth(email)

    const passwordsMatch = user
			? await this.comparePasswords(password, user.password)
			: false

    if (user && passwordsMatch) {
      const { id, firstName, lastName, email, role } = user
      return {
        user: { id, firstName, lastName, email, role },
        token: this.issueToken({ id, firstName, lastName, email }),
      }
    } else {
      throw new UnauthorizedError('Invalid login or password')
    }
  }
}
