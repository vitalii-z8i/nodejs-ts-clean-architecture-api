export default interface IRequest {
  token?: string
  params?: Record<string, string | number | boolean>
  body?: unknown
}
