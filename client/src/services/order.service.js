import { consumeService } from './utils/service'

export const getOrders = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `orders?${params.toString()}`,
    method: 'GET'
  })
}

export const createOrder = async (orderData) => {
  return await consumeService({
    url: 'orders',
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

export const updateOrder = async (id, orderData) => {
  return await consumeService({
    url: `orders/${id}`,
    method: 'PUT',
    body: JSON.stringify(orderData)
  })
}

export const deactivateOrder = async (id) => {
  return await consumeService({
    url: `orders/${id}/deactivate`,
    method: 'PATCH'
  })
}