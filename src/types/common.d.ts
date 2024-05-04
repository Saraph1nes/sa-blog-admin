export type RequestCommonRes<T> = {
  Code: number
  Data: T
  Msg: string
  Success: boolean
}

export type ITimestamps = {
  CreatedAt: string
  UpdatedAt: string
}

export type ISoftDeletes = {
  DeletedAt: string | null
}

export type IOperators = {
  CreatedBy: string
  UpdatedBy: string
}
