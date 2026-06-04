import API from './axiosApi'

export const sendOTP = (email) => API.post('/auth/send-otp', { email })

export const verifyOTP = (email, otp) => API.post('/auth/verify-otp', { email, otp })