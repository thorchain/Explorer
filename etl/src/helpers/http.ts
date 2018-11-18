import fetch, { Response } from 'node-fetch'

type ResponseWithParsedBody = Response & { bodyParsed?: any }

/**
 * Helper to check the HTTP response status and reject the returned promise if a response with
 * status < 200 or >= 300 was received
 */
function rejectIfStatusNotOk(response: ResponseWithParsedBody) {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Received status code ${response.status}`)
  }
  return response
}

/**
 * Helper to parse the response as JSON / binary (depending on content-type)
 */
function parseBody(response: Response) {
  return response.json().then((bodyParsed: any) => {
    const responseWithParsedBody: ResponseWithParsedBody = response
    responseWithParsedBody.bodyParsed = bodyParsed
    return responseWithParsedBody
  })
}

/**
 * Helper to return just the parsed response body to remove all unncessary response data
 */
function selectParsedBody(response: ResponseWithParsedBody) {
  return response.bodyParsed
}

/**
 * Helper to make http requests
 * @param  method  The HTTP method (may be 'get', 'post', 'put', 'patch', 'delete')
 * @param  url     The options for this request. Options are: route, id, filter
 * @param  options Additional options that are to be passed on to fetch
 * @param  body    The data that should be send to the url
 * @return         The promise that will be fulfilled with the response or rejected
 *                 with an error
 */
function httpRequest(method: string, url: string, options?: any, body?: any) {
  // method must always be defined via the method param
  if (options && options.method) {
    throw new Error(`http 'method' must not be defined in the http options object`)
  }

  const defaults: any = {
    headers: {
      Accept: 'application/json',
    },
    method,
    protocol: 'http:',
    timeout: 30e3,
  }
  if (typeof body === 'object') {
    defaults.headers['Content-Type'] = 'application/json'
    defaults.body = JSON.stringify(body)
  }

  return fetch(url, { ...defaults, ...options })
    .then(parseBody)
    .then(rejectIfStatusNotOk)
    .then(selectParsedBody)
}

export const http = {
  delete: (url: string, options?: any) => httpRequest('DELETE', url, options),
  get: (url: string, options?: any) => httpRequest('GET', url, options),
  patch: (url: string, data?: any, options?: any) => httpRequest('PATCH', url, options, data),
  post: (url: string, data?: any, options?: any) => httpRequest('POST', url, options, data),
  put: (url: string, data?: any, options?: any) => httpRequest('PUT', url, options, data),
}
