import axios from 'axios'
const http = axios.create({
  baseURL: 'http://wfda8599.natappfree.cc',
  timeout: 5000,
})
export default http