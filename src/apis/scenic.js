import http1 from '@/utils/https1'
export const getScenic = () => {
  return http1({
    url: '/scenicDisplay',
    method: 'get',
  })
}
export const getScenicDetail = (id) => {
  return http1({
    url: '/scenicDetail',
    method: 'get',
    params: {
      id: id,
    },
  })
}
