import querystring from 'querystring'

import history from 'src/navigation/history'

const CLIENT_ID = '241835236195-dvreitmvc896io4ls2su01ojc8r9i7p8.apps.googleusercontent.com'
const REDIRECT = 'http://localhost:8080/oauth2callback'

async function request (path, options) {
  const response = await fetch(path, options)
  if (response.status === 404 || response.status === 200) {
    return response.json()
  } else {
    console.log(response)
    return {}
  }
}

async function post (path, data) {
  console.log(data)
  return request(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

async function get (path, data) {
  return request(path + '?' + querystring.stringify(data), {})
}

export function login () {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

  const form = document.createElement('form')
  form.setAttribute('method', 'GET')
  form.setAttribute('action', oauth2Endpoint)

  const params = {
    'client_id': CLIENT_ID,
    'redirect_uri': REDIRECT,
    'response_type': 'token',
    'scope': 'https://www.googleapis.com/auth/userinfo.email',
  }

  for (const p in params) {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', p)
    input.setAttribute('value', params[p])
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}

export async function validate (token) {
  const auth = await get('https://www.googleapis.com/oauth2/v3/tokeninfo', { access_token: token })
  if (auth.aud !== CLIENT_ID) {
    history.replace('/')
  }
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('exp', auth.exp)
  console.log(auth)
  history.replace('/home')
}

export function logout () {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('exp')
}

export function authenticated () {
  console.log(Date.now() - JSON.parse(window.localStorage.getItem('exp')) * 1000)
  return Date.now() < JSON.parse(window.localStorage.getItem('exp')) * 1000
}
