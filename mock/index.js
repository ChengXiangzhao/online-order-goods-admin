import Mock from 'mockjs'
import userAPI from './user'
import business from './business';

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })

// User
Mock.mock(/\/mock\/user\/login/, 'post', userAPI.login)
Mock.mock(/\/mock\/user\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/mock\/user\/logout/, 'post', userAPI.logout)

// secen
Mock.mock(/\/mock\/admin\/business\/scene\/listinfo.html/, 'get', business.scenesList)
Mock.mock(/\/mock\/admin\/business\/scene\/add.html/, 'post', business.scenesAdd)

// purchasing
Mock.mock(/\/mock\/admin\/business\/purchasing\/listinfo.html/, 'get', business.purchasingList)

export default Mock
