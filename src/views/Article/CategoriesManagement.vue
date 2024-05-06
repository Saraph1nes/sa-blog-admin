<script lang="ts" setup>
import service from '@/utils/http'
import dayjs from 'dayjs'
import { onMounted, ref, watch } from 'vue'

import type { ITimestamps, RequestCommonRes } from '@/types/common'
import type { Ref } from 'vue'

type ICategory = ITimestamps & {
  ID: number
  Name: string
  CreatedAt: string
  UpdatedAt: string
}

const categories: Ref<ICategory[]> = ref([])
const categoriesCount: Ref<number> = ref(0)
const pageIndex: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(10)

const fetchGetCategory = (): Promise<RequestCommonRes<ICategory[]>> => {
  return service.get('/admin/getCategory')
}

watch(pageIndex, async () => {
  const { Data } = await fetchGetCategory(pageIndex.value, pageSize.value)

  categories.value = Data.List
  categoriesCount.value = Data.Count
})

watch(pageSize, async () => {
  pageIndex.value = 1
  const { Data } = await fetchGetCategory(pageIndex.value, pageSize.value)
  categories.value = Data.List
  categoriesCount.value = Data.Count
})

onMounted(async () => {
  const { Data } = await fetchGetCategory()
  categories.value = Data.List
  categoriesCount.value = Data.Count
})
</script>
<template>
  <el-table :data="categories" stripe row-key="ID">
    <el-table-column prop="ID" label="ID" width="80" />
    <el-table-column prop="Name" label="分类名称" />
    <el-table-column prop="CreatedAt" label="创建时间">
      <template #default="scope">
        {{ dayjs(scope.row.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作">
      <template #default>
        <el-button link type="primary" size="small"> 详情 </el-button>
        <el-button link type="primary" size="small">编辑</el-button>
        <el-button link type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    class="mt-8 float-right"
    v-model:current-page="pageIndex"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    background
    layout="total, sizes, prev, pager, next"
    :total="categoriesCount"
    hide-on-single-page
  />
</template>
<style scoped></style>
