import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TagsManagement from '../views/Article/TagsManagement.vue'
import ArticleManagement from '../views/Article/ArticleManagement.vue'
import ArticleEdit from '../views/Article/ArticleEdit.vue'
import CategoriesManagement from '../views/Category/CategoriesManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/article',
      name: 'ArticleManagement',
      component: ArticleManagement
    },
    {
      path: '/article/:id',
      name: 'ArticleEdit',
      component: ArticleEdit
    },
    {
      path: '/article/tags',
      name: 'TagsManagement',
      component: TagsManagement
    },
    {
      path: '/article/categories',
      name: 'CategoriesManagement',
      component: CategoriesManagement
    }
  ]
})

export default router
