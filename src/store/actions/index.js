// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import cookie from '../../utils/cookie'


/* 导出actions方法 */
import {showLoading, hideLoading, showFullscreenImg, hideFullscreenImg} from './widgetUi'

import {initNimSDK} from './initNimSDK'

import {updateFriend, addFriend, deleteFriend} from './friends'
import {resetSearchResult, searchUsers, searchTeam} from './search'
import {deleteSession, setCurrSession, resetCurrSession} from './session'
import {
    sendMsg,
    sendFileMsg,

    revocateMsg,
    getHistoryMsgs,
    resetNoMoreHistoryMsgs,

} from './msgs'
import {markSysMsgRead, resetSysMsgs, deleteSysMsgs} from './sysMsgs'

import {
    delegateTeamFunction,
    onTeamNotificationMsg,
    enterSettingPage,
    getTeamMembers,

    getTeamMsgReads
} from './team'


import  Vue from  'vue'

function connectNim({state, commit, dispatch}, obj) {
    let {force} = Object.assign({}, obj)
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim || force) {
        let loginInfo = {
            uid: cookie.readCookie('uid'),
            sdktoken: cookie.readCookie('sdktoken'),
        }
        if (!loginInfo.uid) {
            // 无cookie，直接跳转登录页

            Vue.router.push('/login')
            // 无历史登录记录，请重新登录
        } else {
            // 有cookie，重新登录
            dispatch('initNimSDK', loginInfo)
        }
    }
}


export default {
    updateRefreshState({commit}) {
        commit('updateRefreshState')
    },

    // UI 及页面状态变更
    showLoading,
    hideLoading,
    showFullscreenImg,
    hideFullscreenImg,

    // 连接sdk请求，false表示强制重连
    connect(store, obj) {
        console.error("connect",obj)
        let {type} = Object.assign({}, obj)

        type = type || 'nim'
        connectNim(store, obj)
    },

    // 用户触发的登出逻辑
    logout({state, commit}) {
        cookie.delCookie('uid')
        cookie.delCookie('sdktoken')
        if (state.nim) {
            state.nim.disconnect()
        }

        Vue.router.push('/login')
    },

    // 初始化 重新连接SDK
    initNimSDK,
    // 清空所有搜索历史纪录
    resetSearchResult,
    // 搜索用户信息
    searchUsers,


    addFriend,
    deleteFriend,
    updateFriend,
    // 删除会话
    deleteSession,
    // 设置当前会话
    setCurrSession,
    // 重置当前会话
    resetCurrSession,
    // 发送消息
    sendMsg,
    sendFileMsg,

    // 消息撤回
    revocateMsg,
    getHistoryMsgs,
    // 重置历史消息状态
    resetNoMoreHistoryMsgs,
    // 标记系统消息已读
    markSysMsgRead,

    resetSysMsgs,
    deleteSysMsgs,

    // 搜索群
    searchTeam,
    // 代理sdk中的群方法
    delegateTeamFunction,
    // 处理群消息回调
    onTeamNotificationMsg,
    // 进入群信息设置页
    enterSettingPage,
    // 获取群成员
    getTeamMembers,


}
