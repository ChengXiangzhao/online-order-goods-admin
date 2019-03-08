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

export function appraisalSet(params, scene_id) {
  return request({
    url: url('/admin/business/appraisal/add.html'),
    method: 'post',
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
    params: { scene_id },
    data: params
  })
}