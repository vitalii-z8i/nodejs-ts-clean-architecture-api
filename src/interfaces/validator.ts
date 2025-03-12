export interface IValidationResult<T> {
    errors?: string[] | { field: string, message: string }[]
    data: T
}

export default interface IValidator<T> {
    validate(body: Partial<T>): IValidationResult<T>
}
