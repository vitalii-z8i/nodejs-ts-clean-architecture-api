import { IError } from "../interfaces";

export default class NotFoundError extends Error implements IError {
    public name = 'NotFoundError'
    public httpStatus = 404

    constructor(public message: string = 'Record not found') {
        super(message)
    }
}
