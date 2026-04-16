import axios from 'axios'
const http = axios.create({
  baseURL: 'http://cd65f6a4.natappfree.cc',
  timeout: 5000,
})
export default http