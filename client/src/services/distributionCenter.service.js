import { consumeService } from './utils/service'

export const getDistributionCenters = async (page = 1, limit = 10, search) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  })
  
  return await consumeService({
    url: `distribution-centers?${params.toString()}`,
    method: 'GET'
  })
}

export const createDistributionCenter = async (distributionCenterData) => {
  return await consumeService({
    url: 'distribution-centers',
    method: 'POST',
    body: JSON.stringify(distributionCenterData)
  })
}

export const updateDistributionCenter = async (id, distributionCenterData) => {
  return await consumeService({
    url: `distribution-centers/${id}`,
    method: 'PUT',
    body: JSON.stringify(distributionCenterData)
  })
}

export const deactivateDistributionCenter = async (id) => {
  return await consumeService({
    url: `distribution-centers/${id}/deactivate`,
    method: 'PATCH'
  })
}