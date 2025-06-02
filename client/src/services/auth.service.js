import { consumeService } from './utils/service'

export const authLogin = async user => {
  return await consumeService({
    url: 'auth/login',
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export const authRegister = async user => {
  return await consumeService({
    url: 'auth/register',
    method: 'POST',
    body: JSON.stringify(user)
  })
}