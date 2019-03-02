import request from '@/utils/request'
let url = request.mockurl;

export function login(username, password) {
  return request({
    url: url('/user/login'),
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: url('/user/info'),
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: url('/user/logout'),
    method: 'post'
  })
}
