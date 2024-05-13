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

const route = useRoute()
const router = useRouter()

const routeId = route.params.id

type IArticleForm = Omit<IArticle, keyof ITimestamps>

const articleData = ref<IArticleForm>({
  CategoryId: null,
  Content: '',
  ID: 0,
  IsPublished: 1,
  Name: '',
  Picture: '',
  Summary: '',
  TagId: null
})

const categories = ref<ICategory[]>([])
const tags = ref<ITag[]>([])

const fetchGetArticleById = async (id: number): Promise<RequestCommonRes<IArticle>> => {
  return service.get(`/admin/getArticle/${id}`)
}

const fetchGetCategory = (): Promise<RequestCommonRes<CommonCountResponse<ICategory>>> => {
  return service.get('/admin/getCategory')
}

const fetchGetTags = (): Promise<RequestCommonRes<ITag[]>> => {
  return service.get('/admin/getTags')
}

const tagsFilterByCategoryId = computed(() => {
  if (articleData.value.CategoryId === 0) {
    return []
  }
  return tags.value.filter((item) => item.CategoryId === articleData.value.CategoryId)
})

const fetchSaveArticle = (params: IArticleForm): Promise<RequestCommonRes<IArticle>> => {
  return service.post('/admin/saveArticle', {
    id: params.ID,
    name: params.Name,
    content: params.Content,
    summary: params.Summary,
    picture: params.Picture,
    categoryId: params.CategoryId,
    tagId: params.TagId,
    isPublished: params.IsPublished
  })
}

const onSubmit = async () => {
  const { Data, Success, Msg } = await fetchSaveArticle(articleData.value)
  if (!Success) {
    return
  }
  ElMessage.success('保存成功')
  router.push('/article')
}

const categoryDialogVisible = ref(false)

const categoryForm = ref<{
  Name: string
}>({
  Name: ''
})

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

const tagDialogVisible = ref(false)

const tagForm = ref<{
  Name: string
}>({
  Name: ''
})

const fetchSaveTag = (
  id: string,
  categoryId: string,
  name: string
): Promise<RequestCommonRes<ICategory>> => {
  return service.post('/admin/saveTag', {
    id,
    categoryId,
    name
  })
}

const onSaveTag = async () => {
  const { Name } = tagForm.value
  const { Success, Msg } = await fetchSaveTag('0', `${articleData.value.CategoryId}`, Name)

  if (!Success) {
    ElMessage.error(Msg || '保存失败')
    return
  }

  ElMessage.success('保存成功')

  const GetTagsRes: RequestCommonRes<ITag[]> = await fetchGetTags()

  tags.value = GetTagsRes.Data

  tagDialogVisible.value = false
}

onMounted(async () => {
  const GetCategoryRes: RequestCommonRes<CommonCountResponse<ICategory>> = await fetchGetCategory()

  categories.value = GetCategoryRes.Data.List

  const GetTagsRes: RequestCommonRes<ITag[]> = await fetchGetTags()

  tags.value = GetTagsRes.Data

  if (+routeId > 0) {
    const GetArticleRes: RequestCommonRes<IArticle> = await fetchGetArticleById(+routeId)
    GetArticleRes.Data.TagId = GetArticleRes.Data.TagId === 0 ? null : GetArticleRes.Data.TagId
    GetArticleRes.Data.CategoryId =
      GetArticleRes.Data.CategoryId === 0 ? null : GetArticleRes.Data.CategoryId
    articleData.value = GetArticleRes.Data
  }
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/article' }"> 文章管理 </el-breadcrumb-item>
    <el-breadcrumb-item>{{ `${+routeId > 0 ? '编辑' : '新增'}文章` }}</el-breadcrumb-item>
  </el-breadcrumb>

  <el-form class="mt-8" :model="articleData" label-width="auto" style="max-width: 1200px">
    <el-form-item label="文章标题" prop="Name">
      <el-input v-model="articleData.Name" />
    </el-form-item>
    <el-form-item label="AI总结">
      <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="articleData.Summary" />
    </el-form-item>
    <el-form-item label="文章分类">
      <el-select v-model="articleData.CategoryId" placeholder="请选择文章分类">
        <template #header>
          <el-button link type="success" @click="categoryDialogVisible = true">新增分类</el-button>
        </template>
        <el-option v-for="item in categories" :key="item.ID" :label="item.Name" :value="item.ID" />
      </el-select>
    </el-form-item>
    <el-form-item label="文章标签" v-if="articleData.CategoryId && articleData.CategoryId > 0">
      <el-select
        v-if="tagsFilterByCategoryId.length"
        v-model="articleData.TagId"
        placeholder="请选择文章标签"
        clearable
      >
        <template #header>
          <el-button link type="success" @click="tagDialogVisible = true">新增标签</el-button>
        </template>
        <el-option
          v-for="item in tagsFilterByCategoryId"
          :key="item.ID"
          :label="item.Name"
          :value="item.ID"
        />
      </el-select>
      <el-button v-else type="success" plain @click="tagDialogVisible = true"> 新增标签 </el-button>
    </el-form-item>

    <el-form-item label="文章内容">
      <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="articleData.Content" />
    </el-form-item>

    <el-form-item label="文章封面">
      <el-input v-model="articleData.Picture" />
    </el-form-item>

    <el-form-item label="文章封面预览" v-show="!!articleData.Picture">
      <el-image :src="articleData.Picture" fit="contain" class="h-80"></el-image>
    </el-form-item>

    <el-form-item class="ml-24">
      <div>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <router-link to="/article" class="ml-4">
          <el-button>返回</el-button>
        </router-link>
      </div>
    </el-form-item>
  </el-form>

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

  <el-dialog v-model="tagDialogVisible" title="新增标签" width="500">
    <el-form :model="tagForm">
      <el-form-item label="标签名称">
        <el-input v-model="tagForm.Name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="tagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSaveTag"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
