// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import cookie from '../../utils/cookie'


import {hideFullscreenImg, hideLoading, showFullscreenImg, showLoading} from './widgetUi'

import {initSIM} from './initSIM'

import {addFriend, deleteFriend, updateFriend} from './friends'
import {resetSearchResult, searchTeam, searchUsers} from './search'
import {deleteSession, resetCurrSession, setCurrSession} from './session'
import {getHistoryMsgs, resetNoMoreHistoryMsgs, revokeMsg, sendFileMsg, sendMsg,} from './msgs'
import {deleteSysMsgs, markSysMsgRead, resetSysMsgs} from './sysMsgs'

import {enterSettingPage,} from './team'

import {getTeamMembers} from './teamMembers'

import Vue from 'vue'

export default {


    // 连接sdk请求
    connect(store) {
        console.error("connect...")

        if (!store.state.sim) {
            console.error("connecting...")
            let loginInfo = {
                uid: cookie.readCookie('uid'),
                token: cookie.readCookie('token'),
            }
            if (!loginInfo.uid) {
                // 无cookie，直接跳转登录页
                // 无历史登录记录，请重新登录
                Vue.router.push('/login')

            } else {
                // 有cookie，重新登录
                store.dispatch('initSIM', loginInfo)
            }
        }
    },

    // 用户触发的登出逻辑
    logout({state, commit}) {
        cookie.delCookie('uid')
        cookie.delCookie('token')
        state.sim && state.sim.disconnect()
        Vue.router.push('/login')
    },
    // UI 及页面状态变更
    showLoading,
    hideLoading,
    showFullscreenImg,
    hideFullscreenImg,


    // 初始化 重新连接
    initSIM,


    // 清空所有搜索历史纪录
    resetSearchResult,
    // 搜索群
    searchTeam,
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
    revokeMsg,
    getHistoryMsgs,

    // 重置历史消息状态
    resetNoMoreHistoryMsgs,

    // 设置没有更多历史消息不暴露出来


    // 标记系统消息已读
    markSysMsgRead,

    resetSysMsgs,
    deleteSysMsgs,



    // 进入群信息设置页
    enterSettingPage,
    // 获取群成员
    getTeamMembers,


}
