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
import { ref } from 'vue'

import service from '@/utils/http'
import type { ICategory, RequestCommonRes } from '@/types/common'
import { ElMessage } from 'element-plus'

type IProps = {
  id: number
}

const categoryDialogVisible = ref(false)

const categoryForm = ref<{
  Name: string
}>({
  Name: ''
})

const props = withDefaults(defineProps<IProps>(), {
  id: 0
})

const emit = defineEmits<{
  (e: 'save'): void
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
  categoryDialogVisible.value = false
  emit('save')
}
</script>

<style scoped lang="scss"></style>
