<template>
  <div class="inline-block" @click="categoryDialogVisible = true">
    <slot></slot>
  </div>

  <el-dialog v-model="categoryDialogVisible" title="新增分类" width="500">
    <el-form :model="categoryForm">
      <el-form-item label="分类名称">
        <el-input v-model="categoryForm.Name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSaveCategory"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import service from '@/utils/http'
import type {
  CommonCountResponse,
  IArticle,
  ICategory,
  RequestCommonRes,
  ITag,
  ITimestamps
} from '@/types/common'
import { ElMessage } from 'element-plus'

const categoryDialogVisible = ref(false)

const categoryForm = ref<{
  Name: string
}>({
  Name: ''
})

const props = defineProps<{
  save: () => {}
}>()

const fetchSaveCategory = (id: string, name: string): Promise<RequestCommonRes<ICategory>> => {
  return service.post('/admin/saveCategory', {
    id,
    name
  })
}

const onSaveCategory = async () => {
  const { Name } = categoryForm.value
  const { Success, Msg } = await fetchSaveCategory('0', Name)

  if (!Success) {
    ElMessage.error(Msg || '保存失败')
    return
  }

  ElMessage.success('保存成功')

  const GetCategoryRes: RequestCommonRes<CommonCountResponse<ICategory>> = await fetchGetCategory()

  categories.value = GetCategoryRes.Data.List

  categoryDialogVisible.value = false
}
</script>

<style scoped lang="scss"></style>
