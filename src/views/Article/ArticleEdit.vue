<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import service from '@/utils/http'
import type {
  CommonCountResponse,
  IArticle,
  ICategory,
  RequestCommonRes,
  ITag
} from '@/types/common'

const route = useRoute()

const routeId = route.params.id

const articleData = ref<IArticle>({
  CategoryId: 0,
  Content: '',
  ID: 0,
  IsPublished: 0,
  Name: '',
  Picture: '',
  Summary: '',
  TagId: 0
})

const categories = ref<ICategory[]>([])
const tags = ref<ITag[]>([])

const fetchGetArticleById = async (id: number) => {
  return service.get(`/admin/getArticle/${id}`)
}

const fetchGetCategory = (): Promise<RequestCommonRes<ICategory[]>> => {
  return service.get('/admin/getCategory')
}
const fetchGetTags = (): Promise<RequestCommonRes<ITag[]>> => {
  return service.get('/admin/getTags')
}

const tagsFilterByCategoryId = computed(() => {
  return tags.value.filter((item) => item.CategoryId === articleData.value.CategoryId)
})

onMounted(async () => {
  const GetCategoryRes: RequestCommonRes<CommonCountResponse<ICategory[]>> =
    await fetchGetCategory()

  categories.value = GetCategoryRes.Data.List

  const GetTagsRes: RequestCommonRes<ITag[]> = await fetchGetTags()

  tags.value = GetTagsRes.Data

  if (routeId > 0) {
    const GetArticleRes: RequestCommonRes<CommonCountResponse<IArticle[]>> =
      await fetchGetArticleById(routeId)
    articleData.value = GetArticleRes.Data
  }
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/article' }"> 文章管理 </el-breadcrumb-item>
    <el-breadcrumb-item>{{ `${routeId > 0 ? '编辑' : '新增'}文章` }}</el-breadcrumb-item>
  </el-breadcrumb>

  <el-form class="mt-8" :model="articleData" label-width="auto" style="max-width: 600px">
    <el-form-item label="文章标题">
      <el-input v-model="articleData.Name" />
    </el-form-item>
    <el-form-item label="AI总结">
      <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="articleData.Summary" />
    </el-form-item>
    <el-form-item label="文章分类">
      <el-select v-model="articleData.CategoryId" placeholder="请选择文章分类">
        <el-option v-for="item in categories" :key="item.ID" :label="item.Name" :value="item.ID" />
      </el-select>
    </el-form-item>
    <el-form-item label="文章标签">
      <el-select v-model="articleData.TagId" placeholder="请选择文章标签" clearable>
        <el-option
          v-for="item in tagsFilterByCategoryId"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
