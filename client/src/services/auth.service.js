import { consumeService } from './utils/service'

export const authLogin = async user => {
  return await consumeService({
    url: 'auth/login',
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export const authMe = async () => {
  return await consumeService({
    url: 'auth/me',
    method: 'GET'
  })
}