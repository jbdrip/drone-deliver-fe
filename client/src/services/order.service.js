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
    url: `orders/${id}/edit`,
    method: 'PUT',
    body: JSON.stringify(orderData)
  })
}

export const confirmOrder = async (id) => {
  return await consumeService({
    url: `orders/${id}/confirm`,
    method: 'PATCH'
  })
}

export const deliverOrder = async (id) => {
  return await consumeService({
    url: `orders/${id}/deliver`,
    method: 'PATCH'
  })
}

export const cancelOrder = async (id, orderData) => {
  return await consumeService({
    url: `orders/${id}/cancel`,
    method: 'PATCH',
    body: JSON.stringify(orderData)
  })
}