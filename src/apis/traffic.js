import http1 from "@/utils/https1";
export const getPlan = (data) => {
  return http1({
    url: '/aiplan',
    method: 'post',
    data,
  })
}
