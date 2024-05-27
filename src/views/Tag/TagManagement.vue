<script lang="ts" setup>
import service from '@/utils/http'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'

import type { CommonCountResponse, ITimestamps, RequestCommonRes, ITag } from '@/types/common'
import type { Ref } from 'vue'

type IArticle = ITimestamps & {
  ID?: number
  Name: string
  Content: string
  Summary: string
  Picture: string
  CategoryId: number
  TagId: number
  IsPublished: boolean
  CommentCount: number
  CategoryName: string
  TagName: string
}

const tags: Ref<ITag[]> = ref([])

const loading = ref<boolean>(false)

const searchForm: Ref<{
  title: string
  isPublished: string
  category: string
}> = ref({
  title: '',
  isPublished: '-1',
  category: '-1'
})

const fetchGetTags = async (): Promise<void> => {
  loading.value = true
  const { Data }: RequestCommonRes<IArticle> = await service.get('/admin/getTags', {
    params: {
      ...searchForm.value
    }
  })
  tags.value = Data
  loading.value = false
}

onMounted(() => {
  fetchGetTags()
})

const onSearch = () => {
  fetchGetTags()
}

const fetchArticleToggleShelf = async (id: number, isPublished: number) => {
  loading.value = true
  const { Success, Msg }: RequestCommonRes<string> = await service.post(
    '/admin/articleToggleShelf',
    {
      id,
      isPublished: `${isPublished}`
    }
  )
  if (!Success) {
    ElMessage.error(Msg || '请求接口错误')
    return
  }
  ElMessage.success(`${isPublished === 1 ? '上' : '下'}架成功`)
  // fetchGetTags()
  loading.value = false
}

const handleArticleToggleShelf = async (id: number, isPublished: number) => {
  fetchArticleToggleShelf(id, isPublished)
}

const fetchDeleteArticle = async (id: number) => {
  loading.value = true
  const { Success, Msg }: RequestCommonRes<string> = await service.post('/admin/deleteArticle', {
    id
  })
  if (!Success) {
    ElMessage.error(Msg || '请求接口错误')
    return
  }
  ElMessage.success(`删除成功`)
  fetchGetTags()
  loading.value = false
}

const handleDelete = async (id: number) => {
  fetchDeleteArticle(id)
}
</script>
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item> 标签管理 </el-breadcrumb-item>
  </el-breadcrumb>
  <el-form inline class="mt-8">
    <el-form-item label="标题">
      <el-input
        v-model="searchForm.title"
        placeholder="请输入标题"
        clearable
        style="width: 160px"
      />
    </el-form-item>
    <el-form-item label="是否发布">
      <el-select v-model="searchForm.isPublished" placeholder="请选择" style="width: 160px">
        <el-option label="全部" value="-1" />
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="onSearch" :loading="loading">查询</el-button>
    </el-form-item>
  </el-form>

  <router-link to="/article/0">
    <el-button type="success" :icon="Plus"> 新增标签 </el-button>
  </router-link>

  <el-table v-loading="loading" class="mt-4" :data="tags" stripe row-key="ID">
    <el-table-column prop="ID" label="ID" width="80" />
    <el-table-column prop="Name" label="名称" />
    <el-table-column prop="CategoryName" label="分类" />
    <el-table-column prop="CreatedAt" label="创建时间">
      <template #default="scope">
        {{ dayjs(scope.row.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="UpdatedAt" label="更新时间">
      <template #default="scope">
        {{ dayjs(scope.row.UpdatedAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column> -->
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <!-- <el-button
          v-if="scope.row.IsPublished === 1"
          link
          type="primary"
          size="small"
          @click="() => handleArticleToggleShelf(scope.row.ID, scope.row.IsPublished)"
        >
          下架
        </el-button>
        <el-button
          v-else
          link
          type="primary"
          size="small"
          @click="() => handleArticleToggleShelf(scope.row.ID, scope.row.IsPublished)"
        >
          上架
        </el-button> -->
        <!-- <el-button link type="primary" size="small"> 详情 </el-button> -->
        <el-button link type="primary" size="small">
          <router-link :to="`/article/${scope.row.ID}`">编辑</router-link>
        </el-button>
        <el-popconfirm
          :title="`你确定删除${scope.row.Name}吗？`"
          @confirm="handleDelete(scope.row.ID)"
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

  <el-divider />
</template>
<style scoped></style>
