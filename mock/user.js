import { param2Obj } from './utils'

const token = 'BvLODAm5MysVK1jA258YHA2ll0ebwLIc';

const tokens = {
  admin: {
    token: token
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'http://www.beeboone.com/images/logo.png',
    name: '贝邦尼'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: '',
    name: 'Normal Editor'
  }
}

export default {
  login: res => {
    const { username } = JSON.parse(res.body)
    const data = tokens[username]

    if (data) {
      return {
        code: 20000,
        data
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: res => {
    const { token: userToken } = param2Obj(res.url)
    if (userToken === token) {
      const info = users['admin'];
      return {
        code: 20000,
        data: info
      }
    }

    return {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  },
  logout: () => {
    return {
      code: 20000,
      data: 'success'
    }
  }
}
