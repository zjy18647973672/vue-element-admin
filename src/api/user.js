import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

/**
 * 获取用户列表
 * @param {object} data {userName, minCreateTime, maxCreateTime, orderBy, orderMethod, pageNum, pageSize}
 * @returns users
 */
export function getUsers(data) {
  const params = new URLSearchParams(data)
  // orderBy由驼峰转为下划线
  if (params.has('orderBy')) {
    params.set('orderBy', params.get('orderBy').replace(/([A-Z])/g, '_$1').toLowerCase())
  }
  const url = `user-api/users?${params.tostring()}`
  return request.get(url)
}
