import { consumeService } from './utils/service'

export const getTransactions = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `credit-transactions?${params.toString()}`,
    method: 'GET'
  })
}

export const createTransaction = async (transactionData) => {
  return await consumeService({
    url: 'credit-transactions',
    method: 'POST',
    body: JSON.stringify(transactionData)
  })
}