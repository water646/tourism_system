import http1 from '@/utils/https1'
export const getNational = () => {
  return http1({
    url: '/nationalDisplay',
    method: 'get',
  })
}
