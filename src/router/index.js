import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/business',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export const asyncRouterMap = [
  // 展会活动
  {
    path: '/business',
    component: Layout,
    redirect: '/business/scene',
    name: '在线订货',
    meta: { title: '在线订货', icon: 'example' },
    children: [
      {
        path: 'scene',
        name: '展会列表',
        component: () => import('@/views/business/scene/Index'),
        meta: { title: '活动列表', icon: 'table' }
      },
      {
        path: 'addScene',
        name: '发布活动',
        hidden: true,
        component: () => import('@/views/business/scene/Add'),
        meta: { title: '发布活动', icon: 'table' }
      },
      {
        path: 'appraisal',
        name: '评款会管理',
        component: () => import('@/views/business/appraisal/Index'),
        meta: { title: '评款会管理', icon: 'table' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
