// ==================== API 响应 ====================

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  /** 状态码，0 表示成功，-1 表示失败 */
  code: number
  /** 错误信息（仅错误时返回） */
  message?: string
  /** 响应数据（仅成功时返回） */
  data?: T
}
