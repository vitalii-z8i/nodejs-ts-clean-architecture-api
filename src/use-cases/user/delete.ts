import { IUseCase } from '../../interfaces'
import { IUserDAO } from '../../interfaces/user'

export default class DeleteUser implements IUseCase<boolean> {
  constructor(protected userDAO: IUserDAO) {}

  async call(id: number): Promise<boolean> {
    return this.userDAO.delete(id)
  }
}
