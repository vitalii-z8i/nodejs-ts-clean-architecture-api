import { User } from "../entities";
import { IPaginated, IRequest, IUseCase } from "../interfaces";

export default class AdminController {
  constructor(
    protected authorizeAdmin: IUseCase<User>,
    protected listUsers: IUseCase<IPaginated<User>>,
    protected updateUser: IUseCase<boolean>,
    protected deleteUser: IUseCase<boolean>
  ) {}

  async users(request: IRequest): Promise<IPaginated<User>> {
    await this.authorizeAdmin.call(request.token)
    const { page, perPage } = request.params as { page: number, perPage: number }
    return this.listUsers.call(page, perPage)
  }

  async usersUpdate(request: IRequest): Promise<boolean> {
    await this.authorizeAdmin.call(request.token)
    const { id } = request.params as { id: number }
    return this.updateUser.call(id, request.body)
  }

  async usersDelete(request: IRequest): Promise<boolean> {
    await this.authorizeAdmin.call(request.token)
    const { id } = request.params as { id: number }
    return this.deleteUser.call(id)
  }
}
