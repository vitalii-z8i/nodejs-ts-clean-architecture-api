import User from "./user";

export default class AuthUser extends User {
  password!: string
  salt!: string

  confirmPassword?: string
}
