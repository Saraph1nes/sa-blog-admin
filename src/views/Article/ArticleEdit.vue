<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

console.log('route.params.id', route.params.id)
</script>

<template>
  <h1>ArticleEdit</h1>
</template>

<style lang="scss" scoped></style>
