export type RequestCommonRes<T> = {
  Code: number
  Data: T
  Msg: string
  Success: boolean
}

export type CommonCountResponse<T> = {
  List: T[]
  Count: number
}

export type ITimestamps = {
  CreatedAt: string
  UpdatedAt: string
}

export type IOperators = {
  CreatedBy: string
  UpdatedBy: string
}

export type ICategory = ITimestamps & {
  ID: number
  Name: string
}

export type ITag = ITimestamps & {
  ID: number
  Name: string
  CategoryId: number
}

export type IArticle = ITimestamps & {
  CategoryId: number | null
  Content: string
  ID: number
  IsPublished: 0 | 1
  Name: string
  Picture: string
  Summary: string
  TagId: number | null
}
