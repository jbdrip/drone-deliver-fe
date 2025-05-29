import { consumeService } from './utils/service'

export const getCustomers = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `customers?${params.toString()}`,
    method: 'GET'
  })
}

export const createCustomer = async (customerData) => {
  return await consumeService({
    url: 'customers',
    method: 'POST',
    body: JSON.stringify(customerData)
  })
}

export const updateCustomer = async (id, customerData) => {
  return await consumeService({
    url: `customers/${id}`,
    method: 'PUT',
    body: JSON.stringify(customerData)
  })
}

export const deactivateCustomer = async (id) => {
  return await consumeService({
    url: `customers/${id}/deactivate`,
    method: 'PATCH'
  })
}