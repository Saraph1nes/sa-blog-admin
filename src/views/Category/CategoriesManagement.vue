<script lang="ts" setup>
import service from '@/utils/http'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddCategoryDialog from '../../components/Category/AddCategoryDialog.vue'

import type { RequestCommonRes, ICategory, CommonCountResponse } from '@/types/common'
import type { Ref } from 'vue'

const loading: Ref<boolean> = ref(false)
const categories: Ref<ICategory[]> = ref([])
const categoriesCount: Ref<number> = ref(0)
// const pageIndex: Ref<number> = ref(1)
// const pageSize: Ref<number> = ref(10)

const fetchGetCategory = async (): Promise<RequestCommonRes<CommonCountResponse<ICategory>>> => {
  loading.value = true
  const { Data } = await service.get('/admin/getCategory')
  categories.value = Data.List
  categoriesCount.value = Data.Count
  loading.value = false
}

onMounted(() => {
  fetchGetCategory()
})

const handleAddCategory = () => {
  fetchGetCategory()
}

const fetchDeleteCategory = async (id: number) => {
  loading.value = true
  const { Success, Msg }: RequestCommonRes<string> = await service.post('/admin/deleteCategory', {
    id
  })
  if (!Success) {
    ElMessage.error(Msg || '请求接口错误')
    return
  }
  ElMessage.success(`删除成功`)
  fetchGetCategory()
  loading.value = false
}

const handleDeleteCategory = async (id) => {
  fetchDeleteCategory(id)
}
</script>
<template>
  <AddCategoryDialog @save="handleAddCategory">
    <el-button :loading="loading" type="success" :icon="Plus"> 新增分类 </el-button>
  </AddCategoryDialog>

  <el-table v-loading="loading" :data="categories" stripe row-key="ID" class="mt-4">
    <el-table-column prop="ID" label="ID" width="80" />
    <el-table-column prop="Name" label="分类名称" />
    <el-table-column prop="CreatedAt" label="创建时间">
      <template #default="scope">
        {{ dayjs(scope.row.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button link type="primary" size="small">编辑</el-button>
        <el-popconfirm
          :title="`你确定删除${scope.row.Name}吗？`"
          @confirm="handleDeleteCategory(scope.row.ID)"
        >
          <template #reference>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- <el-pagination
    class="mt-8 float-right"
    v-model:current-page="pageIndex"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    background
    layout="total, sizes, prev, pager, next"
    :total="categoriesCount"
    hide-on-single-page
  /> -->
</template>
<style scoped></style>
