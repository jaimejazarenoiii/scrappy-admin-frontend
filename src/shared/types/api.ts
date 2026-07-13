export type Role =
  | 'super_admin'
  | 'admin'
  | 'support'
  | 'finance'
  | 'sales'
  | 'read_only_analyst'

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ListQueryParams {
  page?: number
  pageSize?: number
  sort?: string
  order?: 'asc' | 'desc'
  q?: string
}
