import Joi from "joi";
import { IValidator } from "../../../interfaces";
import { IValidationResult } from "../../../interfaces/validator";

export default class JOIValidator<T> implements IValidator<T> {
    constructor(protected schema: Joi.Schema<T>) {}

    public validate(data: T): IValidationResult<T> {
        const result = this.schema.validate(data)
        const errors = result.error
        ? result.error.details.map((ed) => ({ field: ed.path.join('.'), message: ed.message }))
        : []

        return { data: result.value, errors }
    }
}
