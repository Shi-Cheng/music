export const commonParams = {
  cgiKey: 'GetHomePage',
  data: {
    comm: {
      g_tk: 5381,
      uin: '',
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1 },
    MusicHallHomePage: {
      module: 'music.musicHall.MusicHallPlatform',
      method: 'MobileWebHome',
      param: { 'ShelfId': [101, 102, 161] }},
    hotkey: {
      module: 'tencent_musicsoso_hotkey.HotkeyService',
      method: 'GetHotkeyForQQMusicMobile',
      param: {
        remoteplace: 'txt.miniapp.wxada7aab80ba27074',
        searchid: '1559616839293' }
    }}
}

// cgiKey: GetHomePage
// _: 1578800164470
// data: {"comm":{"g_tk":5381,"uin":"","format":"json","inCharset":"utf-8","outCharset":"utf-8",
// "notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},
// "hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074",
// "searchid":"1559616839293"}}}

export const discListParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
export const options = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0
