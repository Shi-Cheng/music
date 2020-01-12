// import jsonp from '../common/js/jsonp'
import axios from 'axios'
import { commonParams, discListParams } from './config'

export function getRecommend() {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  return axios.get(url, {
    params: commonParams
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, discListParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
