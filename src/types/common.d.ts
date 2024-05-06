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

export type IOperators = {
  CreatedBy: string
  UpdatedBy: string
}
