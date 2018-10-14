
import Vue from 'vue'

import WS from '@/utils/ws'

import util from '@/utils'
import store from '../'
import {onFriends} from './friends'

import {onMyInfo, onUserInfo} from './userInfo'
import {onSessions} from './session'
import {onMsg} from './msgs'
import {onSysMsg} from './sysMsgs'
import {onTeamMembers, onTeams,} from './team'


// 重新初始化
export function initNimSDK({state, commit, dispatch}, loginInfo) {
    if (state.nim) {
        state.nim.disconnect()
    }
    dispatch('showLoading')


    const SDK = {

        account: loginInfo.uid,
        token: loginInfo.sdktoken,


        // 好友
        onfriends: onFriends,


        // 我的名片
        onmyinfo: onMyInfo,


        // 好友的名片
        onusers: onUserInfo,


        // 群组
        onteams: onTeams,


        // 群成员
        onteammembers: onTeamMembers,


        // 会话
        onsessions: onSessions,


        // 消息
        onmsg: onMsg,
        // 系统通知
        onsysmsg: onSysMsg,

        // 同步完成
        onsyncdone: function onSyncDone() {
            dispatch('hideLoading')
            // 说明在聊天列表页
            if (store.state.currSessionId) {
                dispatch('setCurrSession', store.state.currSessionId)
            }
        },
        disconnect: () => {
            window.ws.close()
        }
    }

    // 初始化SDK
    window.nim = state.nim = SDK


    window.ws = new WS("url",
        (evt) => {
            // 连接建立后的回调(登录成功), 会传入一个对象, 包含登录的信息
            if (loginInfo) {
                // 连接上以后更新uid
                commit('updateUserUID', loginInfo)
            }
        },
        (data) => {
        },
        (err) => {
            alert(JSON.stringify(err))

            alert('网络连接状态异常')
            Vue.router.push('/login')
        },
        (err) => {
            switch (err.code) {
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
                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[str] || '其他端')}踢出下线!`
                    Vue.router.push('/login')
                    break
                default:
                    break
            }
        })
}
