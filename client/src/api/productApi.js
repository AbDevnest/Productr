import API from './axiosApi'

export const getProducts = () => API.get('/products')
export const addProduct = (data) => API.post('/products/create', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const updateProduct = (id, data) => API.put(`/products/update/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const deleteProduct = (id) => API.delete(`/products/delete/${id}`)
export const togglePublish = (id) => API.patch(`/products/publish/${id}`)
export const deleteImage = (id, image_name) => API.delete(`/products/image/delete/${id}`, { data: { image_name } })