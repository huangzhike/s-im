import store from '../'
import config from '../../configs'
import util from '../../utils'


import {request_post} from "../../common/request";


/*

离线消息：他人发给自己的消息，且自己的账号在任何客户端都未读过，则算离线消息；离线消息只要其它任何一端(包括自己)已读，则不会再收到对应消息。
漫游消息：他人发给自己的消息，在本客户端未读过，但在其他客户端如iOS/android/pc...读过，则算漫游消息；漫游消息只有本端已读，才不会再下推。

1）消息的同步：一般至少要支持在线和离线推送，高级的IM系统还支持『多端同步』；
2）消息的存储：消息存储即消息的持久化保存，对应的就是『消息漫游』。可以实现账号在任意端登陆查看所有历史消息。


*/


let msg = {

    scene: 'p2p' || 'team',
    // 消息发送方, 帐号或群id
    from: "",
    // 消息发送方的昵称
    fromNick: "",
    // 发送方的设备类型
    fromClientType: "",
    // 发送端设备id
    fromDeviceId: "",
    // 消息接收方, 帐号或群id
    to: "",
    // 时间戳
    time: "",
    // 消息类型 文本消息 图片消息 音频消息 视频消息 文件消息 地理位置消息 自定义消息
    // 提醒消息 提醒消息用于会话内的状态提醒，如进入会话时出现的欢迎消息，或者会话命中敏感词后的提示消息等等
    // AI机器人消息 群通知消息
    type: 'text' || 'image' || 'audio' || 'video' || 'file' || 'geo' || 'custom' || 'tip' || 'robot' || 'notification',
    // 消息所属的会话对象的ID
    sessionId: "",
    // 聊天对象, 账号或者群id
    target: "",
    // 消息的流向 表示此消息是收到的消息 表示此消息是发出的消息
    flow: 'in' || 'out',

    // 消息发送状态 发送中 发送成功 发送失败
    status: 'sending' || 'success' || 'fail',
    // 文本消息的文本内容, 请参考发送文本消息
    text: "",
    // 文件消息的文件对象, 具体字段请参考图片对象、音频对象、视频对象、文件对象, 请参考发送文件消息
    file: "",
    // 地理位置消息的地理位置对象, 请参考发送地理位置消息
    geo: "",
    // 提醒消息的内容, 请参考发送提醒消息
    tip: "",
    // 自定义消息或机器人回复消息的消息内容, 开发者可以自行扩展, 建议封装成JSON格式字符串, 请参考发送自定义消息
    content: "",
    // 群通知消息的附加信息, 参考群通知消息来查看不同类型的群通知消息对应的附加信息
    // 群通知消息对应的消息对象有一个字段attach包含了额外的信息
    attach: {
        type:
            "updateTeam" ||
            "addTeamMembers" ||
            "removeTeamMembers" ||
            "acceptTeamInvite" ||
            "passTeamApply" ||
            "addTeamManagers" ||
            "removeTeamManagers" ||
            "leaveTeam" ||
            "dismissTeam" ||
            "transferTeam" ||
            "updateTeamMute"


        ,

        // 如果attach有account或者accounts字段, 那么attach的字段users包含这些账号对应的用户名片
        account: "",
        accounts: "",
    },

    // SDK生成的消息id, 在发送消息之后会返回给开发者, 开发者可以在发送消息的回调里面根据这个ID来判断相应消息的发送状态, 到底是发送成功了还是发送失败了,
    // 然后根据此状态来更新页面的UI。如果发送失败, 那么可以重发消息

    idClient: "",
    // 服务器用于区分消息用的ID, 主要用于获取云端历史记录/
    idServer: "",


    // 该消息在接收方是否应该被静音
    isMuted: "",
    // 是否是重发的消息
    resend: "",
    // 扩展字段 推荐使用JSON格式构建
    custom: "",

    // 自定义推送文案
    pushContent: "",
    // 自定义的推送属性 推荐使用JSON格式构建
    pushPayload: "",
    // 是否需要推送昵称
    needPushNick: "",
    // 特殊推送选项, 只在群会话中使用
    apns: {
        // 需要特殊推送的账号列表, 此字段不存在的话表示推送给当前会话内的所有用户
        accounts: "",
        // 需要特殊推送的文案
        content: "",
        // 是否强制推送, true 表示即使推送列表中的用户屏蔽了当前会话（如静音）, 仍能够推送当前这条内容给相应用户
        forcePush: "",
    },
    // 是否存储云端历史
    isHistoryable: "",
    // 是否支持漫游
    isRoamingable: "",
    // 是否支持发送者多端同步
    isSyncable: "",
    // 是否支持抄送
    cc: "",
    // 是否需要推送
    isPushable: "",
    // 是否要存离线
    isOfflinable: "",
    // 是否计入消息未读数
    isUnreadable: "",

}


export function formatMsg(msg) {
    return msg
}

export function onMsg(msg) {
    msg = formatMsg(msg)
    // 丢进去
    store.commit('putMsg', msg)
    // 如果当前会话打开了
    if (msg.sessionId === store.state.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
            type: 'put',
            msg
        })
        // 发送已读回执

    }
    // 群消息
    if (msg.scene === 'team' && msg.type === 'notification') {

    }
}

function onSendMsgDone(error, msg) {
    store.dispatch('hideLoading')
    if (error) {
        // 被拉黑
        if (error.code === 7101) {
            msg.status = 'success'
            alert(error.message)
        } else {
            alert(error.message)
        }
    }
    onMsg(msg)
}

// 消息撤回
export function onRevocateMsg(error, msg) {

    if (error) {
        error.code === 508 ? console.error('发送时间超过2分钟的消息，不能被撤回') : console.error(error)
        return
    }
    let tip = ''
    if (msg.from === store.state.userUID) {
        tip = '你撤回了一条消息'
    } else {
        let userInfo = store.state.userInfos[msg.from]
        if (userInfo) {
            tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`
        } else {
            tip = '对方撤回了一条消息'
        }
    }
    // 收到服务器应答后发送给对方并删除消息

    request_post("sendTipMsg", {
        isLocal: true,
        scene: msg.scene,
        to: msg.to,
        tip,
        time: msg.time,

    }).then(resp => {

        let idClient = msg.deletedIdClient || msg.idClient
        store.commit('replaceMsg', {
            sessionId: msg.sessionId,
            idClient,
            msg: resp.data
        })
        if (msg.sessionId === store.state.currSessionId) {
            store.commit('updateCurrSessionMsgs', {
                type: 'replace',
                idClient,
                msg: resp.data
            })
        }

    }).catch(console.error)


}


export function revokeMsg({state, commit}, msg) {

    let {idClient} = msg
    msg = Object.assign(msg, state.msgsMap[idClient])

    request_post("deleteMsg", {
        msg
    }).then(resp => {
        onRevocateMsg(null, resp.data)
    }).catch(console.error)


}

// 发送普通消息
export function sendMsg({state, commit}, obj) {

    obj = obj || {}
    let type = obj.type || ''
    store.dispatch('showLoading')
    switch (type) {
        case 'text':
            request_post("sendText", {
                scene: obj.scene,
                to: obj.to,
                text: obj.text,
            }).then(resp => {
                onSendMsgDone(null, resp.data)
            }).catch(console.error)

            break

    }
}

// 发送文件消息
export function sendFileMsg({state, commit}, obj) {

    let {scene, to, fileInput} = obj
    let type = 'file'
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
        type = 'image'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
        type = 'video'
    }
    store.dispatch('showLoading')


    request_post("sendFile", {
        scene,
        to,
        type,
        fileInput,
    }).then(resp => {
        onSendMsgDone(null, resp.data)
    }).catch(err => {
    })


}

// 获取更多历史消息
export function getHistoryMsgs({state, commit}, obj) {
    const sim = state.sim
    if (sim) {
        let {scene, to} = obj
        let options = {
            scene,
            to,
            limit: config.localMsgLimitCount || 20,
        }
        if (state.currSessionLastMsg) {
            options = Object.assign(options, {
                lastMsgId: state.currSessionLastMsg.idServer,
                endTime: state.currSessionLastMsg.time,
            })
        }
        store.dispatch('showLoading')

        request_post("getHistoryMsgs", options).then(resp => {

            let msg = resp.data.data
            if (msg) {
                if (msg.length === 0) {
                    commit('setNoMoreHistoryMsgs')
                } else {
                    let msgs = msg.map(msg => formatMsg(msg))
                    // 合并历史消息
                    commit('updateCurrSessionMsgs', {
                        type: 'concat',
                        msgs: msgs
                    })
                }
            }
            store.dispatch('hideLoading')

        }).catch(err => console.error(err))

    }
}

export function resetNoMoreHistoryMsgs({commit}) {
    commit('resetNoMoreHistoryMsgs')
}
