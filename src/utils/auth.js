import { setSessionStorage, getSessionStorage, removeSessionStorage } from './storage'

const tokenKey = 'auth_token'

export function getToken() {
  return getSessionStorage(tokenKey);
}

export function setToken(token) {
  setSessionStorage(tokenKey, token);
}

export function removeToken() {
  removeSessionStorage(tokenKey);
}
