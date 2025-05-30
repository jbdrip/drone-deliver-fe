import { consumeService } from './utils/service'

export const getProducts = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `products?${params.toString()}`,
    method: 'GET'
  })
}

export const createProduct = async (productData) => {
  return await consumeService({
    url: 'products',
    method: 'POST',
    body: JSON.stringify(productData)
  })
}

export const updateProduct = async (id, productData) => {
  return await consumeService({
    url: `products/${id}`,
    method: 'PUT',
    body: JSON.stringify(productData)
  })
}

export const deactivateProduct = async (id) => {
  return await consumeService({
    url: `products/${id}/deactivate`,
    method: 'PATCH'
  })
}