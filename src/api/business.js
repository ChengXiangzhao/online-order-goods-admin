import request from '@/utils/request';

let url = request.url;

// scene
export function listScene(params) {
  return request({
    url: url('/admin/business/scene/listinfo.html'),
    method: 'get',
    params
  })
}

export function addScene(params) {
  return request({
    url: url('/admin/business/scene/add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    data: params
  })
}

export function sceneDetail(id) {
  return request({
    url: url('/admin/business/scene/view.html'),
    method: 'get',
    params: { id }
  })
}

export function updateScene(params, id) {
  return request({
    url: url('/admin/business/scene/update.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { id },
    data: params
  })
}

export function delScene(id) {
  return request({
    url: url('/admin/business/scene/delete.html'),
    method: 'post',
    params: { id }
  })
}

// appraisal
export function appraisalList(params) {
  return request({
    url: url('/admin/business/appraisal/listinfo.html'),
    method: 'get',
    params
  })
}

export function queryAappraisalDict(params) {
  return request({
    url: url('/admin/business/appraisal/listinfo.html'),
    method: 'get',
    params
  })
}

// 添加评款设置
export function appraisalAdd(params, scene_id) {
  return request({
    url: url('/admin/business/appraisal/add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}

export function appraisalUpdate(params, scene_id) {
  return request({
    url: url('/admin/business/appraisal/update.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}

// 待评款商品
export function queryAppGoods(params) {
  return request({
    url: url('/admin/shop/goods/grade-putin.html'),
    method: 'get',
    params
  })
}

// 添加评款商品
export function addAppGoods(params, scene_id) {
  return request({
    url: url('/admin/shop/goods/grade-add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}

//  查询已添加商品
export function querySelectedGoods(params) {
  return request({
    url: url('/admin/shop/scene-grade/listinfo.html'),
    method: 'get',
    params
  })
}

//purchasing
export function purchasingList(params) {
  return request({
    url: url('/admin/business/purchasing/listinfo.html'),
    method: 'get',
    params
  })
}

export function queryPurchasingDict(params) {
  return request({
    url: url('/admin/business/purchasing/listinfo.html'),
    method: 'get',
    params
  })
}

export function purchasingAdd(params, scene_id) {
  return request({
    url: url('/admin/business/purchasing/add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}

// 待订货商品
export function queryPurGoods(params) {
  return request({
    url: url('/admin/shop/website-goods/scene-putin.html'),
    method: 'get',
    params
  })
}

// 添加订货商品
export function addPurGoods(params, scene_id) {
  return request({
    url: url('/admin/shop/website-goods/scene-add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}

//  查询已添加订货商品
export function querySelectedPurGoods(params) {
  return request({
    url: url('/admin/shop/scene-goods/listinfo.html'),
    method: 'get',
    params
  })
}

// 商家列表查询
export function teamworkList(params) {
  return request({
    url: url('/admin/merchant/teamwork/listinfo.html'),
    method: 'get',
    params
  })
}