import http1 from '@/utils/https1'
export const getGoods = () => {
  return http1({
    url: '/goodsDisplay',
    method: 'get',
  })
}
export const getGoodsDetail = (id) => {
  return http1({
    url: `/goodsDetail`,
    method: 'get',
    params: {
      id: id,
    },
  })
}
