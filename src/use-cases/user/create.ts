import { AuthUser, User } from '../../entities';
import { IUserDAO } from '../../interfaces/user';
import { IUseCase, IValidator } from '../../interfaces';
import { ValidationError } from '../../errors';


export default class CreateUser implements IUseCase<User> {
    constructor (
        protected validator: IValidator<AuthUser>,
        protected userDAO: IUserDAO,
        protected encryptPassword: (password: string) => Promise<{ password: string; salt: string }>
    ) {}

    async call(payload: Pick<AuthUser, 'email' | 'firstName' | 'lastName' | 'role' | 'password'>): Promise<User> {
        const { data, errors } = this.validator.validate(payload)
        if (errors && errors.length > 0) {
            throw new ValidationError("The data is invalid", errors)
        }

        const { password, salt } = await this.encryptPassword(data.password)
        Object.assign(data, {
            password,
            salt,
        })

        return this.userDAO.create(data)
    }
}
