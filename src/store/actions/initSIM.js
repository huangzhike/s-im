import Vue from 'vue'

import WS from '../../utils/ws'

import {request_post} from "../../common/request";

import util from '../../utils'

import {onFriends} from './friends'
import {onMyInfo, onUserInfo} from './userInfo'
import {onSessions} from './session'
import {onMsg} from './msgs'
import {onSysMsg} from './sysMsgs'
import {onTeamMembers, onTeams,} from './team'

import config from '../../configs'

let resp = {
    msg: "",
    code: "",
    type: "",
    data: {},
}

// 重新初始化
export function initSIM({state, commit, dispatch}, loginInfo) {

    state.sim && state.sim.disconnect()

    dispatch('showLoading')


    // 初始化
    window.sim = state.sim = {

        account: loginInfo.uid,
        token: loginInfo.token,

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
            state.currSessionId && dispatch('setCurrSession', state.currSessionId)
        },
        disconnect: window.ws.close
    }


    window.ws = new WS(config.webSocketUrl + loginInfo.token,
        async (evt) => {
            console.error(evt)
            // 连接建立后的回调
            // 连接上以后更新uid
            loginInfo && commit('updateUserUID', loginInfo)

            // 开始同步消息
            await request_post(`${config.apiUrl}getSessions`, {}).then(resp => {
                state.sim.onsessions(resp.data.data)
            }).catch(err => {
            })
            await request_post(`${config.apiUrl}getTeams`, {}).then(resp => {
                state.sim.onteams(resp.data.data)
            }).catch(err => {
            })
            await request_post(`${config.apiUrl}getFriends`, {}).then(resp => {
                state.sim.onfriends(resp.data.data)
            }).catch(err => {
            })

            state.sim.onsyncdone()

        },
        (data) => {
            // onMessage
            console.error("onMessage: ", data)
            if (data.type === "msg") {
                state.sim.onmsg(resp.data.data)
            } else if (data.type === "sysMsg") {
                state.sim.onsysmsg(resp.data.data)
            } else if (data.type === "team") {
                state.sim.onteams(resp.data.data)
            } else if (data.type === "friend") {
                state.sim.onfriends(resp.data.data)
            } else {
                console.error("else end: ", data)
            }


        },
        (err) => {
            // 错误回调
            console.error(JSON.stringify(err))

            alert('网络连接状态异常')
            Vue.router.push('/login')
        },
        (err) => {
            // 关闭回调
            switch (err.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    Vue.router.push('/login')
                    break
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    let map = {
                        PC: '电脑版',
                        Web: '网页版',
                        Android: '手机版',
                    }

                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[err.from] || '其他端')}踢出下线!`
                    console.error(errorMsg)
                    Vue.router.push('/login')
                    break
                default:
                    break
            }
        })
}