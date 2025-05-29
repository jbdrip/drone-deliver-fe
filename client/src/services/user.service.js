import { consumeService } from './utils/service'

export const getUsers = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `users?${params.toString()}`,
    method: 'GET'
  })
}

export const createUser = async (userData) => {
  return await consumeService({
    url: 'users',
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export const updateUser = async (id, userData) => {
  return await consumeService({
    url: `users/${id}`,
    method: 'PUT',
    body: JSON.stringify(userData)
  })
}

export const deactivateUser = async (id) => {
  return await consumeService({
    url: `users/${id}/deactivate`,
    method: 'PATCH'
  })
}