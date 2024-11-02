interface HttpBody {
  [key: string]: unknown
}

interface HttpClient {
  get: <T>(url: string) => Promise<T>
  post: <T>(url: string, body: HttpBody) => Promise<T>
}

const BASE_URL = 'http://localhost:4000' // TODO: env

export const httpClient: HttpClient = {
  get: async <T>(url: string) => {
    const res = await fetch(`${BASE_URL}${url}`)
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json() as T
  },

  post: async <T>(url: string, body: HttpBody) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(body), // TODO: body type
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json() as T
  }
}
