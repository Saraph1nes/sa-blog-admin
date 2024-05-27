<script lang="ts" setup>
import service from '@/utils/http'
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SaveCategoryDialog from '../../components/Category/SaveCategoryDialog.vue'

import type { RequestCommonRes, ICategory, CommonCountResponse } from '@/types/common'
import type { Ref } from 'vue'

const loading: Ref<boolean> = ref(false)
const categories: Ref<ICategory[]> = ref([])
const categoriesCount: Ref<number> = ref(0)
// const pageIndex: Ref<number> = ref(1)
// const pageSize: Ref<number> = ref(10)

const fetchGetCategory = async () => {
  loading.value = true
  const { Data }: RequestCommonRes<CommonCountResponse<ICategory>> =
    await service.get('/admin/getCategory')
  categories.value = Data.List
  categoriesCount.value = Data.Count
  loading.value = false
}

onMounted(() => {
  fetchGetCategory()
})

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

const handleDeleteCategory = async (id: number) => {
  fetchDeleteCategory(id)
}
</script>
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item> 分类管理 </el-breadcrumb-item>
  </el-breadcrumb>

  <SaveCategoryDialog @save="fetchGetCategory">
    <el-button class="mt-8" :loading="loading" type="success" :icon="Plus"> 新增分类 </el-button>
  </SaveCategoryDialog>

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
        <SaveCategoryDialog :name="scope.row.Name" :id="scope.row.ID" @save="fetchGetCategory">
          <el-button link type="primary" size="small">编辑</el-button>
        </SaveCategoryDialog>
        <el-popconfirm
          :title="`你确定删除${scope.row.Name}吗？`"
          @confirm="handleDeleteCategory(scope.row.ID)"
          confirm-button-text="确定"
          cancel-button-text="取消"
          cancel-button-type="outline"
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
