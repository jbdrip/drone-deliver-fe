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

export const forgotPassword = async email => {
  return await consumeService({
    url: 'auth/forgot-password',
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

export const resetPassword = async (token, newPassword) => {
  return await consumeService({
    url: 'auth/reset-password',
    method: 'POST',
    body: JSON.stringify({ 
      token, 
      new_password: newPassword 
    })
  })
}