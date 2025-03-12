export default interface IUseCase<T> {
    call(...args: unknown[]): T | Promise<T>
}
