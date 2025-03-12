export default interface IError {
    name: string
    message: string
    httpStatus: number
    details?: unknown
  }
