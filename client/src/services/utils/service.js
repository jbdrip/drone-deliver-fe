import Cookies from 'js-cookie'

export async function consumeService({ url, method, body = null }) {
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
  const content = await res.json()
  if (res.status === 401 && !window.location.href.includes('/login/')) {
    window.location.href =  content.msg === 'Token has expired' ? '/login/' : '/401/'
  }
  return content
}