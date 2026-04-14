import http2 from '@/utils/https2'
export const getMap=(params)=>{
  return http2({
    url: '/v3/staticmap',
    method: 'get',
    params,
  })
}
