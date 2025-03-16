import { IError } from '../interfaces'

export default class ValidationError extends Error implements IError {
  public name = 'ValidationError'
  public httpStatus = 422

  constructor(public message: string = 'Provided data is invalid', public details?: {field: string, message: string}[] | string[]) {
    super(message)
  }
}
