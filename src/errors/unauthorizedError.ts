import { IError } from '../interfaces'

export default class UnauthorizedError extends Error implements IError {
  public name = 'UnauthorizedError'
  public httpStatus = 401

  constructor(public message: string = 'Unautorized') {
    super(message)
  }
}
