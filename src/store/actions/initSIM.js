import Vue from 'vue'

import WS from '../../utils/ws'

import {request_post} from "../../common/request";

import util from '../../utils'

import {onFriends} from './friends'
import {onMyInfo, onUserInfo} from './userInfo'
import {onSessions} from './session'
import {onMsg} from './msgs'
import {onSysMsgs} from './sysMsgs'
import {onTeams,} from './team'
import {onTeamMembers,} from './teamMembers'

import config from '../../configs'
// 会话列表
let respSession = {
    msg: "OK",
    code: "200",
    type: "session",
    data: {
        event: "init",
        list: [{}, {}],
    },
}


let respMsg = {
    msg: "OK",
    code: "200",
    type: "msg",
    data: {
        event: "init",
        list: [{}, {}],
    },
}

// 群组列表
let respTeam = {
    msg: "OK",
    code: "200",
    type: "team",
    data: {
        event: "init",
        list: [{}, {}],
    },
}

// 好友列表List
let respFriend = {
    msg: "OK",
    code: "200",
    type: "friend",
    data: {
        event: "init",
        list: [{}, {}],
        friend: {}
    },
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
        onsysmsg: onSysMsgs,

        // 同步完成
        onsyncdone: function onSyncDone() {

            console.error("onsyncdone...")
            dispatch('hideLoading')
            // 说明在聊天列表页
            state.currSessionId && dispatch('setCurrSession', state.currSessionId)
        },
        // 关闭连接
        disconnect: window.ws.close
    }


    window.ws = new WS(config.webSocketUrl + loginInfo.token,
        async (evt) => {
            console.error(evt)
            // 连接建立后的回调
            // 连接上以后更新uid
            loginInfo && commit('updateUserUID', loginInfo)


            // 开始同步消息 并行

            let getFriendList = request_post('getFriendList', loginInfo)

            let getSessionList = request_post('getSessionList', loginInfo)

            let getTeamList = request_post('getTeamList', loginInfo)

            getTeamList.then(resp => {

                let teamId = resp.data.list.map(v => v.id)

                request_post('getTeamMemberList', {teamId}).then(resp => {
                    //  更新群成员列表
                    state.sim.onteammembers(resp.data)
                })

            })


            let getUserInfo = request_post('getUserInfo', loginInfo)


            let getSessionListResp = await getSessionList;
            // 更新会话
            state.sim.onsessions(getSessionListResp.data)


            let getFriendListResp = await getFriendList;
            // 更新好友列表
            state.sim.onfriends(getFriendListResp.data)


            let getTeamListResp = await getTeamList;
            // 更新群列表
            state.sim.onteams(getTeamListResp.data)

            let getUserInfoResp = await getUserInfo;
            // 更新你的个人信息
            state.sim.onmyinfo(getUserInfoResp.data)

            // 回调
            state.sim.onsyncdone()

        },
        (msg) => {
            // onMessage
            console.error("onMessage: ", msg)
            if (msg.type === "msg") {
                state.sim.onmsg(msg.data)
            } else if (msg.type === "sysMsg") {
                state.sim.onsysmsg(msg.data)
            } else if (msg.type === "team") {
                state.sim.onteams(msg.data)
            } else if (msg.type === "friend") {
                state.sim.onfriends(msg.data)
            } else {
                console.error("else end: ", msg)
            }


        },
        (err) => {
            // 错误回调
            console.error('网络连接状态异常', JSON.stringify(err))

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
                        Web: '网页版',
                        Android: '手机版',
                    }

                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[err.from] || '其他端')}踢出下线!`
                    console.error("关闭回调", errorMsg)
                    Vue.router.push('/login')
                    break
                default:
                    break
            }
        })
}
