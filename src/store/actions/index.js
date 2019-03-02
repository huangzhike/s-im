// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。


import {hideFullscreenImg, hideLoading, showFullscreenImg, showLoading} from './widgetUi'

import {initSIM} from './initSIM'

import {addFriend, deleteFriend, updateFriend} from './friends'
import {resetSearchResult, searchTeam, searchUsers} from './search'
import {deleteSession, resetCurrSession, setCurrSession} from './session'
import {getHistoryMsgs, resetNoMoreHistoryMsgs, sendFileMsg, sendMsg,} from './msgs'
import {deleteSysMsgs, markSysMsgRead, resetSysMsgs, revokeMsg} from './sysMsgs'

import {enterSettingPage, delegateFunction} from './team'

import {getTeamMembers} from './teamMemberMap'

import vue from '../../main'

import config from '../../configs'

export default {

    // 连接请求
    connect(store) {
        console.error("connect...")
        // 刷新页面 或者第一次登陆
        if (!store.state.sim) {
            console.error("connecting...")
            let loginInfo = {
                uid: window.sessionStorage.getItem(config.constant.uid),
                token: window.sessionStorage.getItem(config.constant.token),
                gateList: JSON.parse(window.sessionStorage.getItem(config.constant.gateList)),
            }
            if (!loginInfo.uid || !loginInfo.token) {
                // 无cookie，直接跳转登录页
                vue.$router.push({
                    name: 'login'
                })
            } else {
                // 有cookie，重新初始化
                store.dispatch('initSIM', loginInfo)
            }
        }
    },

    // 用户触发的登出逻辑
    logout({state, commit}) {
        window.sessionStorage.removeItem(config.constant.uid)
        window.sessionStorage.removeItem(config.constant.token)
        window.sessionStorage.removeItem(config.constant.gateList)
        state.sim && state.sim.disconnect()
        vue.$router.push({
            name: 'login'
        })
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

    delegateFunction
}
