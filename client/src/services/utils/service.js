import Cookies from 'js-cookie'

export async function consumeService({ url, method, body = null, redirectOn401 = true }) {
  const accessToken = Cookies.get('access_token') || ''
  const baseUrl = `${import.meta.env.VITE_SERVER_URL}${url}`
  
  const res = await fetch(baseUrl, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const contentType = res.headers.get('content-type')
  const content = contentType?.includes('application/json') ? await res.json() : {}

  if (res.status === 401 && redirectOn401 && !window.location.href.includes('/login')) {
    const isTokenExpired = content?.msg === 'Token has expired'
    window.location.href = isTokenExpired ? '/login/' : '/401/'
  }
  return content
}