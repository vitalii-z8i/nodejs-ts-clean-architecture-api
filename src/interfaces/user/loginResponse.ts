import { User } from '../../entities'

export default interface ILoginResponse {
	user: Partial<User>
	token: string
}
