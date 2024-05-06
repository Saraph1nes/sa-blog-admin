<script lang="ts" setup>
import service from '@/utils/http'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'

import type { CommonCountResponse, ITimestamps, RequestCommonRes } from '@/types/common'
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

const articles: Ref<IArticle[]> = ref([])
const articlesCount: Ref<number> = ref(0)

const pageIndex: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(10)

const searchForm: Ref<{
  title: string
  isPublished: string
  category: string
}> = ref({
  title: '',
  isPublished: '-1',
  category: '-1'
})

const fetchGetArticle = async (): Promise<void> => {
  const { Data }: RequestCommonRes<CommonCountResponse<IArticle>> = await service.get(
    '/admin/getArticle',
    {
      params: {
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
        ...searchForm.value
      }
    }
  )
  articles.value = Data.List
  articlesCount.value = Data.Count
}

watch(pageIndex, async () => {
  fetchGetArticle()
})

watch(pageSize, () => {
  pageIndex.value = 1
  fetchGetArticle()
})

onMounted(() => {
  fetchGetArticle()
})

const onSearch = () => {
  pageIndex.value = 1
  fetchGetArticle()
}

const fetchArticleToggleShelf = async (id: number, isPublished: number) => {
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
  fetchGetArticle()
}

const handleArticleToggleShelf = async (id: number, isPublished: number) => {
  fetchArticleToggleShelf(id, isPublished === 1 ? 0 : 1)
}
</script>
<template>
  <el-form inline>
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
      <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>

  <el-button type="success" :icon="Plus"> 新增文章 </el-button>

  <el-table class="mt-4" :data="articles" stripe row-key="ID">
    <el-table-column prop="ID" label="ID" width="80" />
    <el-table-column prop="Name" label="名称" />
    <el-table-column prop="Picture" label="图片">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-image lazy style="width: 80px; height: 80px" :src="scope.row.Picture" fit="cover" />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="IsPublished" label="是否发布">
      <template #default="scope">
        <el-tag v-if="scope.row.IsPublished" type="success"> 是 </el-tag>
        <el-tag v-else type="error"> 否 </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="CategoryName" label="分类名称" />
    <el-table-column prop="TagName" label="标签名称" />
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button
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
        </el-button>
        <el-button link type="primary" size="small"> 详情 </el-button>
        <el-button link type="primary" size="small">编辑</el-button>
        <el-button link type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="CommentCount" label="评论数" />
    <el-table-column prop="CreatedAt" label="创建时间">
      <template #default="scope">
        {{ dayjs(scope.row.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
  </el-table>

  <el-divider />

  <el-pagination
    class="float-right"
    v-model:current-page="pageIndex"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    background
    layout="prev, pager, next, sizes, total"
    :total="articlesCount"
  />
</template>
<style scoped></style>