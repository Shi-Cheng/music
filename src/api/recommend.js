import jsonp from '../common/js/jsonp'
import axios from 'axios'
import { commonParams, discListParams, options } from './config'

export function getRecommend() {
  const url = '/api/getRecommend'
  const data = Object.assign({}, discListParams, {
    params: commonParams
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return jsonp(url, data, options)
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

export function getSongVkey(songmid) {
  // 通过songmid来获取vkey,拼接歌曲地址
// http://dl.stream.qqmusic.qq.com/{filename}?vkey={vkey}&fromtag=66
  const url = '/api/getSongVkey'
  const data = Object.assign({}, discListParams, {
    g_tk: '678733985',
    'hostUin': '0',
    'format': 'json',
    'inCharset': 'utf8',
    'notice': '0',
    'platform': 'yqq',
    'needNewCode': '0',
    'cid': '205361747',
    'songmid': songmid,
    'filename': 'C100' + songmid + '.m4a',
    'guid': '1674273789'
  })
  return axios.get(url, { params: data }).then(response => {
    return Promise.resolve(response.data)
  })
}
