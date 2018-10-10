/*
 * 用户账号信息
 */

import store from '../'
import config from '../../configs'
import util from '../../utils'

let userInfo = {
    // 账号
    account: "",
    // 昵称
    nick: "",
    // 头像
    avatar: "",
    // 签名
    sign: "",
    // 性别
    gender: 'unknown' || 'male' || 'female',
    // 邮箱
    email: "",
    // 生日
    birth: "",
    // 电话号码
    tel: "",
    // 扩展字段 推荐使用JSON格式构建
    custom: "",
    // 创建时间
    createTime: "",
    // 更新时间
    updateTime: "",

}


export function formatUserInfo(obj) {

    let gender = ''
    switch (obj.gender) {
        case 'male':
            gender = '男'
            break
        case 'female':
            gender = '女'
            break
        case 'unknown':
            gender = ''
            break
    }

    let custom = obj.custom || ''
    try {
        custom = JSON.parse(custom)
    } catch (e) {
        custom = {
            data: custom
        }
    }

    if (obj.avatar) {

    } else {
        obj.avatar = config.defaultUserIcon
    }

    let result = Object.assign(obj, {
        account: obj.account,
        nick: obj.nick || '',
        avatar: obj.avatar || config.defaultUserIcon,
        birth: obj.birth || '',
        email: obj.email || '',

        gender,
        sign: obj.sign || '',
        custom,
        createTime: obj.createTime || (new Date()).getTime(),
        updateTime: obj.updateTime || (new Date()).getTime()
    })

    return result
}

export function onMyInfo(obj) {
    obj = util.mergeObject(store.state.myInfo, obj);
    let myInfo = formatUserInfo(obj)
    store.commit('updateMyInfo', myInfo)
}

export function onUserInfo(users) {
    if (!Array.isArray(users)) {
        users = [users]
    }
    users = users.map(formatUserInfo)
    store.commit('updateUserInfo', users)
}
