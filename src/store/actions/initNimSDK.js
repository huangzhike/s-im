/*
 * SDK连接相关
 */

import Vue from 'vue'

import util from '@/utils'
import store from '../'
import {onFriends, onSyncFriendAction} from './friends'

import {onMyInfo, onUserInfo} from './userInfo'
import {onSessions, onUpdateSession} from './session'
import {onRoamingMsgs, onOfflineMsgs, onMsg} from './msgs'
import {onSysMsgs, onSysMsg, onSysMsgUnread} from './sysMsgs'
import {
    onTeams,
    onSynCreateTeam,
    onCreateTeam,
    onUpdateTeam,
    onTeamMembers,
    onUpdateTeamMember,
    onAddTeamMembers,
    onRemoveTeamMembers,
    onUpdateTeamManagers,
    onDismissTeam,

} from './team'

// import SDK from '../../sdk/NIM_Web_SDK_v5.0.0'
//
const SDK = {
    NIM: {
        getInstance: function (obj) {

            let o = {
                mergeSessions: function () { },
                cutSessionsByIds: function () { },
                mergeFriends: function () { },
                cutFriends: function () { },
                // 搜索
                getUsers: function () { },
                getTeam: function () { },
            }


            return obj
        }
    }
}

// console.error(SDK)

// 重新初始化 NIM SDK
export function initNimSDK({state, commit, dispatch}, loginInfo) {
    if (state.nim) {
        state.nim.disconnect()
    }
    dispatch('showLoading')
    // 初始化SDK
    window.nim = state.nim = SDK.NIM.getInstance({


        account: loginInfo.uid,
        token: loginInfo.sdktoken,

        syncSessionUnread: true,

        // 连接建立后的回调(登录成功), 会传入一个对象, 包含登录的信息
        onconnect: function onConnect(event) {
            if (loginInfo) {
                // 连接上以后更新uid
                commit('updateUserUID', loginInfo)
            }
        },
        // 发生错误的回调, 会传入错误对象
        onerror: function onError(event) {
            alert(JSON.stringify(event))

            alert('网络连接状态异常')
            Vue.router.push('/login')
        },
        // 即将重连的回调
        onwillreconnect: function onWillReconnect() {
            console.log(event)
        },
        // 断开连接后的回调
        ondisconnect: function onDisconnect(error) {
            switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    Vue.router.push('/login')
                    // 帐号或密码错误
                    break
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    let map = {
                        PC: '电脑版',
                        Web: '网页版',
                        Android: '手机版',
                    }
                    let str = error.from
                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[str] || '其他端')}踢出下线，请确定帐号信息安全!`
                    Vue.router.push('/login')
                    break
                default:
                    break
            }
        },

        // 好友
        onfriends: onFriends,
        onsyncfriendaction: onSyncFriendAction,


        // 我的名片
        onmyinfo: onMyInfo,
        onupdatemyinfo: onMyInfo,

        // 好友的名片
        onusers: onUserInfo,
        onupdateuser: onUserInfo,

        // 群组
        onteams: onTeams,
        onsynccreateteam: onSynCreateTeam,

        onCreateTeam: onCreateTeam,
        onDismissTeam: onDismissTeam,
        onUpdateTeam: onUpdateTeam,

        // 群成员
        onteammembers: onTeamMembers,
        onupdateteammember: onUpdateTeamMember,

        onAddTeamMembers: onAddTeamMembers,
        onRemoveTeamMembers: onRemoveTeamMembers,
        onUpdateTeamManagers: onUpdateTeamManagers,


        // 会话
        onsessions: onSessions,
        onupdatesession: onUpdateSession,


        // 漫游消息
        onroamingmsgs: onRoamingMsgs,
        // 离线消息
        onofflinemsgs: onOfflineMsgs,
        // 消息
        onmsg: onMsg,
        // 系统通知
        onsysmsg: onSysMsg,
        // 离线系统通知
        onofflinesysmsgs: onSysMsgs,

        onupdatesysmsg: onSysMsg, // 通过、拒绝好友申请会收到此回调

        onsysmsgunread: onSysMsgUnread,
        onupdatesysmsgunread: onSysMsgUnread,

        // 同步完成
        onsyncdone: function onSyncDone() {
            dispatch('hideLoading')
            // 说明在聊天列表页
            if (store.state.currSessionId) {
                dispatch('setCurrSession', store.state.currSessionId)
            }
        }
    })
}
