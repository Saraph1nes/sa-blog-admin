<script setup lang="ts">
import { onMounted, ref } from 'vue'
import service from '@/utils/http'

import type { Ref } from 'vue'
import type { RequestCommonRes, ITimestamps, ISoftDeletes, IOperators } from '@/types/common'

type IMenu = ITimestamps &
  ISoftDeletes &
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

const menuDataset: Ref<null | IMenu[]> = ref(null)

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
      <el-aside class="border-r" width="200px">
        <el-header class="h-auto flex items-center border-b">
          <div
            class="flex-1 text-lg text-black font-bold text-center pointer-events-none select-none flex items-center"
          >
            <img height="30" width="30" src="https://www.sablogs.cn/favicon.ico" />
            <span class="ml-2">SaAdmin</span>
          </div>
        </el-header>
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
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped></style>
