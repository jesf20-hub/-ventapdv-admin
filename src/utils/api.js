const API_URL = 'https://ventapdv-api-production.up.railway.app'

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export const api = {
  // Products
  getProducts: () => fetchAPI('/api/products'),
  addProduct: (p) => fetchAPI('/api/products', { method: 'POST', body: JSON.stringify(p) }),
  updateProduct: (id, p) => fetchAPI(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deleteProduct: (id) => fetchAPI(`/api/products/${id}`, { method: 'DELETE' }),

  // Clients  
  getClients: () => fetchAPI('/api/clients'),
  addClient: (c) => fetchAPI('/api/clients', { method: 'POST', body: JSON.stringify(c) }),
  updateClient: (id, c) => fetchAPI(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(c) }),
  deleteClient: (id) => fetchAPI(`/api/clients/${id}`, { method: 'DELETE' }),

  // Sales
  getSales: () => fetchAPI('/api/sales'),

  // Sync
  syncAll: () => fetchAPI('/api/sync'),
}