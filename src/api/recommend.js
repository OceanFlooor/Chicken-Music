import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = debug ? '/api/getDiscList' : 'http://106.14.31.21/music/api/getDiscList'
  const params = Object.assign({}, commonParams, {
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

  return axios({
    url,
    method: 'get',
    params
  })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(e => {
      console.log(e)
    })
}

export function getSongList(disstid) {
  const url = debug ? '/api/getSongList' : 'http://106.14.31.21/music/api/getSongList'
  const params = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios({
    url,
    method: 'get',
    params
  })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(e => {
      console.log(e)
    })
}
