import request from '@/utils/request';

let url = request.url;

export function getList(params) {
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
