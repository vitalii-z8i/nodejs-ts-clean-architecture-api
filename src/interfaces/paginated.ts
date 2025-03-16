export default interface IPaginated<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
  }
}
