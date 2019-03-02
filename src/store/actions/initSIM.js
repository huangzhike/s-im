import WS from '../../utils/ws'
import protoRoot from '@/proto/proto'
import protobuf from 'protobufjs'
import {request_get, request_post} from "../../utils/request";

import util from '../../utils'

import {onFriends} from './friends'
import {onMyInfo} from './userInfo'
import {onSessions} from './session'
import {onMsg} from './msgs'
import {onSysMsgs} from './sysMsgs'
import {onTeams,} from './team'
import {onTeamMembers,} from './teamMemberMap'

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
export async function initSIM({state, commit, dispatch}, loginInfo) {

    state.sim && state.sim.disconnect()

    dispatch('showLoading')

    // 初始化
    window.sim = state.sim = {

        // 关闭连接
        disconnect: window.ws.close,
        send: window.ws.send,

    }

    // 连接上以后更新uid
    loginInfo && commit('updateUserUID', loginInfo)

    // 开始同步消息 并行

    let getFriendList = request_get('getFriendList')

    let getSessionList = request_get('getSessionList')

    let getTeamList = request_get('getGroupList')

    let getUserInfo = request_get('getUserInfo')


    getTeamList.then(resp => {

        let teamId = resp.data && resp.data.map(v => v.id)

        request_get('getGroupMemberList', {teamId}).then(resp => {
            //  更新群成员列表
            onTeamMembers(resp.data)
        })

    })


    let getSessionListResp = await getSessionList;
    // 更新会话
    onSessions(getSessionListResp.data)


    let getFriendListResp = await getFriendList;
    // 更新好友列表
    onFriends(getFriendListResp.data)


    let getTeamListResp = await getTeamList;
    // 更新群列表
    onTeams(getTeamListResp.data)


    let getUserInfoResp = await getUserInfo;
    // 更新个人信息
    onMyInfo(getUserInfoResp.data)

    let len = loginInfo.gateList.length
    let idx = Math.floor(Math.random() * (len - 0 + 1) + 0)
    let webSocketUrl = loginInfo.gateList[idx];

    window.ws = state.ws = new WS(webSocketUrl,
        (evt) => {
            console.error(evt)
            // 连接建立后的回调
        },
        (msg) => {
            // onMessage
            console.error("onMessage: ", msg)
            if (msg.type === "msg") {
                onMsg(msg.data)
            } else if (msg.type === "sysMsg") {
                onSysMsgs(msg.data)
            } else if (msg.type === "team") {
                onTeams(msg.data)
            } else if (msg.type === "friend") {
                onFriends(msg.data)
            } else {
                console.error("else end: ", msg)
            }

        },
        (err) => {
            // 错误回调
            console.error('网络连接状态异常', JSON.stringify(err))
        },
        (err) => {
            // 关闭回调
            switch (err.code) {
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    let map = {
                        Web: '网页版',
                        Android: '手机版',
                    }
                    let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[err.from] || '其他端')}踢出下线!`
                    console.error("kicked", errorMsg)
                    break
                default:
                    break
            }
        })

    // 回调
    console.error("onSyncDone...")
    dispatch('hideLoading')
    // 说明在聊天列表页
    state.currSessionId && dispatch('setCurrSession', state.currSessionId)


}
