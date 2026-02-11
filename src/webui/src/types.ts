/** WebUI 前端类型定义 */

export interface ApiResponse<T = unknown> {
  code: number
  data?: T
  message?: string
}
