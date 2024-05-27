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
  CategoryName?: string
}

export type IArticle = ITimestamps & {
  ID: number
  Name: string
  Content: string
  Summary: string
  Picture: string
  CategoryId: number | null
  TagId: number | null
  IsPublished: 0 | 1
}
