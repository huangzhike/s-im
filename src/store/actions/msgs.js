import store from '../'
import config from '../../configs'
import util from '../../utils'


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
        account:"",
        accounts:"",
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

/*

updateTeam' (更新群)
更新群后, 所有群成员会收到一条类型为'updateTeam'的群通知消息。

{
}
此类群通知消息的from字段的值为更新群的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为被更新的群信息


'addTeamMembers' (拉人入群)
普通群, 拉人入群后, 所有群成员会收到一条类型为'addTeamMembers'的群通知消息。

此类群通知消息的from字段的值为拉人的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段accounts的值为被拉的人的帐号列表, attach有一个字段members的值为被拉的群成员列表。


'removeTeamMembers' (踢人出群)
踢人出群后, 所有群成员会收到一条类型为'removeTeamMembers'的群通知消息。
此类群通知消息的from字段的值为踢人的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段accounts的值为被踢的人的帐号列表。


'acceptTeamInvite' (接受入群邀请)
高级群的群主和管理员在邀请成员加入群（通过操作创建群或拉人入群）之后, 被邀请的人会收到一条类型为'teamInvite'的系统通知,
此类系统通知的from字段的值为邀请方的帐号, to字段的值为对应的群ID,
此类系统通知的attach有一个字段team的值为被邀请进入的群, 被邀请的人可以选择接受邀请或者拒绝邀请。
如果接受邀请, 那么该群的所有群成员会收到一条类型为'acceptTeamInvite'的群通知消息, 此类群通知消息的from字段的值为接受入群邀请的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段members的值为接收入群邀请的群成员列表。
如果拒绝邀请, 那么邀请你的人会收到一条类型为'rejectTeamInvite'的系统通知, 此类系统通知的from字段的值为拒绝入群邀请的用户的帐号, to字段的值为对应的群ID。



'passTeamApply' (通过入群申请)
用户可以申请加入高级群, 目标群的群主和管理员会收到一条类型为'applyTeam'的系统通知,
此类系统通知的from字段的值为申请方的帐号, to字段的值为对应的群ID, 高级群的群主和管理员在收到入群申请后, 可以选择通过或者拒绝入群申请。
如果通过申请, 那么该群的所有群成员会收到一条类型为'passTeamApply'的群通知消息, 此类群通知消息的from字段的值为通过入群申请的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段account的值为申请方的帐号, attach有一个字段members的值为被通过申请的群成员列表。
如果拒绝申请, 那么申请人会收到一条类型为'rejectTeamApply'的系统通知, 此类系统通知的from字段的值为拒绝方的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群。


'addTeamManagers' (添加群管理员)
添加群管理员后, 所有群成员会收到一条类型为'addTeamManagers'的群通知消息。
此类群通知消息的from字段的值为添加群管理员的人的帐号, to字段的值为对应的群ID, attach有一个字段accounts的值为被加为管理员的帐号列表, attach有一个字段members的值为被加为管理员的群成员列表

'removeTeamManagers' (移除群管理员)
移除群管理员后, 所有群成员会收到一条类型为'removeTeamManagers'的群通知消息。
此类群通知消息的from字段的值为移除群管理员的人的帐号, to字段的值为对应的群ID, attach有一个字段accounts的值为被移除的管理员的帐号列表, attach有一个字段members的值为被移除管理员的群成员列表


'leaveTeam' (主动退群)
主动退群后, 所有群成员会收到一条类型为'leaveTeam'的群通知消息。
此类群通知消息的from字段的值为退群的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象。


'dismissTeam' (解散群)
解散群后, 所有群成员会收到一条类型为'dismissTeam'的群通知消息。
此类群通知消息的from字段为解散群的人的帐号, to字段的值为被对应的群ID。


'transferTeam' (转让群)
转让群后, 所有群成员会收到一条类型为'transferTeam'的群通知消息。
此类群通知消息的from字段的值为转让群的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段account的值为为新群主的帐号, attach有一个字段members的值为包含新旧群主的群成员列表。


'updateTeamMute' (更新群成员禁言状态)
更新群成员禁言状态后, 所有群成员会收到一条类型为'updateTeamMute'的群通知消息。
此类群通知消息的from字段的值为操作方, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段account的值为被禁言的帐号, attach有一个字段members的值为被禁言的群成员列表。

*/

export function formatMsg(msg) {

    return msg
}

export function onRoamingMsgs(obj) {
    let msgs = obj.msgs.map(msg => {
        return formatMsg(msg)
    })
    store.commit('updateMsgs', msgs)
}

export function onOfflineMsgs(obj) {
    let msgs = obj.msgs.map(msg => {
        return formatMsg(msg)
    })
    store.commit('updateMsgs', msgs)
}

export function onMsg(msg) {
    msg = formatMsg(msg)
    store.commit('putMsg', msg)
    if (msg.sessionId === store.state.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
            type: 'put',
            msg
        })
        // 发送已读回执

    }
    if (msg.scene === 'team' && msg.type === 'notification') {
        store.dispatch('onTeamNotificationMsg', msg)
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
    const nim = store.state.nim
    if (error) {
        if (error.code === 508) {
            alert('发送时间超过2分钟的消息，不能被撤回')
        } else {
            alert(error)
        }
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
    nim.sendTipMsg({
        isLocal: true,
        scene: msg.scene,
        to: msg.to,
        tip,
        time: msg.time,
        done: function sendTipMsgDone(error, tipMsg) {
            let idClient = msg.deletedIdClient || msg.idClient
            store.commit('replaceMsg', {
                sessionId: msg.sessionId,
                idClient,
                msg: tipMsg
            })
            if (msg.sessionId === store.state.currSessionId) {
                store.commit('updateCurrSessionMsgs', {
                    type: 'replace',
                    idClient,
                    msg: tipMsg
                })
            }
        }
    })
}


export function revocateMsg({state, commit}, msg) {
    const nim = state.nim
    let {idClient} = msg
    msg = Object.assign(msg, state.msgsMap[idClient])
    nim.deleteMsg({
        msg,
        done: function deleteMsgDone(error) {
            onRevocateMsg(error, msg)
        }
    })
}

// 发送普通消息
export function sendMsg({state, commit}, obj) {
    const nim = state.nim
    obj = obj || {}
    let type = obj.type || ''
    store.dispatch('showLoading')
    switch (type) {
        case 'text':
            nim.sendText({
                scene: obj.scene,
                to: obj.to,
                text: obj.text,
                done: onSendMsgDone,
                needMsgReceipt: obj.needMsgReceipt || false
            })
            break

    }
}

// 发送文件消息
export function sendFileMsg({state, commit}, obj) {
    const nim = state.nim
    let {scene, to, fileInput} = obj
    let type = 'file'
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
        type = 'image'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
        type = 'video'
    }
    store.dispatch('showLoading')
    nim.sendFile({
        scene,
        to,
        type,
        fileInput,
        uploadprogress: function (data) {
            // console.log(data.percentageText)
        },
        uploaderror: function () {
            console && console.log('上传失败')
        },
        uploaddone: function (error, file) {
            // console.log(error);
            // console.log(file);
        },
        beforesend: function (msg) {
            // console && console.log('正在发送消息, id=', msg);
        },
        done: function (error, msg) {
            onSendMsgDone(error, msg)
        }
    })
}



export function getHistoryMsgs({state, commit}, obj) {
    const nim = state.nim
    if (nim) {
        let {scene, to} = obj
        let options = {
            scene,
            to,
            reverse: false,
            asc: true,
            limit: config.localMsglimit || 20,
            done: function getHistoryMsgsDone(error, obj) {
                if (obj.msgs) {
                    if (obj.msgs.length === 0) {
                        commit('setNoMoreHistoryMsgs')
                    } else {
                        let msgs = obj.msgs.map(msg => {
                            return formatMsg(msg)
                        })
                        commit('updateCurrSessionMsgs', {
                            type: 'concat',
                            msgs: msgs
                        })
                    }
                }
                store.dispatch('hideLoading')
            }
        }
        if (state.currSessionLastMsg) {
            options = Object.assign(options, {
                lastMsgId: state.currSessionLastMsg.idServer,
                endTime: state.currSessionLastMsg.time,
            })
        }
        store.dispatch('showLoading')
        nim.getHistoryMsgs(options)
    }
}

export function resetNoMoreHistoryMsgs({commit}) {
    commit('resetNoMoreHistoryMsgs')
}
