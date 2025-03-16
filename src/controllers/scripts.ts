import { AuthUser, User } from "../entities";
import { IRequest, IUseCase } from "../interfaces";

export default class ScriptsController {
    constructor(protected createUser: IUseCase<User>) {}

    async createAdmin(request: IRequest): Promise<User> {
        const { email, password } = request.body as Pick<AuthUser, 'email' | 'password'>

        return this.createUser.call({
            email,
            password,
            firstName: 'Admin',
            lastName: 'Adminson',
            role: 'admin',
        })
    }
}
