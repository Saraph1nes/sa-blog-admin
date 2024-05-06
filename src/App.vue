<script setup lang="ts">
import service from '@/utils/http'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import type { IOperators, ITimestamps, RequestCommonRes } from '@/types/common'
import type { Ref } from 'vue'

type IMenu = ITimestamps &
  IOperators & {
    ID: number
    MenuName: string
    ParentId: number
    OrderNum: number
    Url: string
    Target: string
    Visible: string
    Icon: string
    Remark: string
    SubMenus: IMenu[]
  }

type IFlatMenu = Omit<IMenu, 'SubMenus'>

const menuDataset: Ref<null | IMenu[]> = ref(null)

const flatMenuDataset: Ref<null | IFlatMenu[]> = ref(null)

const routeName = computed(() => {
  return flatMenuDataset.value?.find((item) => item.Url === route.path)?.MenuName
})

const route = useRoute()

// menuDataset树转列表
const flatMenu = (menuDataset: IMenu[]): IFlatMenu[] => {
  const res: IFlatMenu[] = []
  if (!menuDataset.length) {
    return []
  }
  menuDataset.forEach((item) => {
    if (item.SubMenus.length) {
      res.push(...flatMenu(item.SubMenus))
    } else {
      res.push(item)
    }
  })
  return res
}

watchEffect(() => {
  flatMenuDataset.value = flatMenu(menuDataset.value || [])
})

onMounted(async () => {
  const fetchGetMenus = (): Promise<RequestCommonRes<IMenu[]>> => {
    return service.get('/admin/getMenus')
  }

  const { Data } = await fetchGetMenus()

  menuDataset.value = Data
})
</script>

<template>
  <el-container class="min-h-screen">
    <el-container>
      <el-aside width="200px">
        <el-header class="h-auto flex items-center justify-center">
          <div class="text-lg text-white font-bold text-center pointer-events-none select-none">
            SaAdmin
          </div>
        </el-header>
        <el-divider class="!m-0 !p-0" />
        <el-menu class="!border-none">
          <template v-for="menuItem in menuDataset" :key="menuItem.ID">
            <el-sub-menu v-if="menuItem.SubMenus.length > 0" :index="`${menuItem.ID}`">
              <template #title>
                <el-icon><component :is="menuItem.Icon" /></el-icon>
                <span>{{ menuItem.MenuName }}</span>
              </template>
              <router-link v-for="subItem in menuItem.SubMenus" :key="subItem.ID" :to="subItem.Url">
                <el-menu-item :index="`${subItem.ID}`">
                  <el-icon><component :is="subItem.Icon" /></el-icon>
                  <span>{{ subItem.MenuName }}</span>
                </el-menu-item>
              </router-link>
            </el-sub-menu>
            <router-link v-else :to="menuItem.Url">
              <el-menu-item :index="`${menuItem.ID}`">
                <el-icon><component :is="menuItem.Icon" /></el-icon>
                <span>{{ menuItem.MenuName }}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-menu>
      </el-aside>
      <el-divider direction="vertical" class="!h-screen !m-0 !p-0" />
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped></style>
