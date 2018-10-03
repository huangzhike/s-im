import store from '../'
import config from '../../configs'
import util from '../../utils'


/*


离线消息：他人发给自己的消息，且自己的账号在任何客户端都未读过，则算离线消息；离线消息只要其它任何一端(包括自己)已读，则不会再收到对应消息。
漫游消息：他人发给自己的消息，在本客户端未读过，但在其他客户端如iOS/android/pc...读过，则算漫游消息；漫游消息只有本端已读，才不会再下推。


*/


/*
消息对象有以下字段

scene: 消息场景
from: 消息发送方, 帐号或群id
fromNick: 消息发送方的昵称
fromClientType: 发送方的设备类型
fromDeviceId: 发送端设备id
to: 消息接收方, 帐号或群id
time: 时间戳
type: 消息类型
sessionId: 消息所属的会话对象的ID
target: 聊天对象, 账号或者群id
flow: 消息的流向
'in'表示此消息是收到的消息
'out'表示此消息是发出的消息
status: 消息发送状态
'sending' 发送中
'success' 发送成功
'fail' 发送失败
text: 文本消息的文本内容, 请参考发送文本消息
file: 文件消息的文件对象, 具体字段请参考图片对象、音频对象、视频对象、文件对象, 请参考发送文件消息
geo: 地理位置消息的地理位置对象, 请参考发送地理位置消息
tip: 提醒消息的内容, 请参考发送提醒消息
content: 自定义消息或机器人回复消息的消息内容, 开发者可以自行扩展, 建议封装成JSON格式字符串, 请参考发送自定义消息
attach: 群通知消息的附加信息, 参考群通知消息来查看不同类型的群通知消息对应的附加信息
idClient: SDK生成的消息id, 在发送消息之后会返回给开发者, 开发者可以在发送消息的回调里面根据这个ID来判断相应消息的发送状态, 到底是发送成功了还是发送失败了, 然后根据此状态来更新页面的UI。如果发送失败, 那么可以重发消息
idServer: 服务器用于区分消息用的ID, 主要用于获取云端历史记录
isMuted: 该消息在接收方是否应该被静音
resend: 是否是重发的消息
custom: 扩展字段
推荐使用JSON格式构建, 非JSON格式的话, Web端会正常接收, 但是会被其它端丢弃
nosScene nos存储场景, 适用于发送文件消息, 默认初始化配置
nosSurvivalTime nos存储场景有效时间, 适用于发送文件消息，默认初始化配置
pushContent: 自定义推送文案
pushPayload: 自定义的推送属性
推荐使用JSON格式构建, 非JSON格式的话, Web端会正常接收, 但是会被其它端丢弃
needPushNick: 是否需要推送昵称
apns: 特殊推送选项, 只在群会话中使用
apns.accounts: 需要特殊推送的账号列表, 此字段不存在的话表示推送给当前会话内的所有用户
apns.content: 需要特殊推送的文案
apns.forcePush: 是否强制推送, true 表示即使推送列表中的用户屏蔽了当前会话（如静音）, 仍能够推送当前这条内容给相应用户
localCustom: 本地自定义扩展字段
在支持数据库时可以调用更新本地消息来更新此字段, 此字段只会被更新到本地数据库, 不会被更新到服务器上
needMsgReceipt: 是否需要业务已读（包含该字段即表示需要），只有设置了业务已读，才可以调用getTeamMsgReads,getTeamMsgReadAccounts等相关方法
isHistoryable: 是否存储云端历史
isRoamingable: 是否支持漫游
isSyncable: 是否支持发送者多端同步
cc: 是否支持抄送
isPushable: 是否需要推送
isOfflinable: 是否要存离线
isUnreadable: 是否计入消息未读数
isLocal: 是否是本地消息, 请查阅发送本地消息


*/

/*

消息场景
消息对象有一个字段scene来标明消息所属的场景, 具体场景如下

'p2p' (点对点消息)
'team' (群消息)
消息类型
消息对象有一个字段type来标明消息的类型, 具体类型如下

'text' (文本消息)
'image' (图片消息)
'audio' (音频消息)
'video' (视频消息)
'file' (文件消息)
'geo' (地理位置消息)
'custom' (自定义消息)
'tip' (提醒消息)
提醒消息用于会话内的状态提醒，如进入会话时出现的欢迎消息，或者会话命中敏感词后的提示消息等等.
'robot' (AI机器人消息)
'notification' (群通知消息)
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
        store.dispatch('sendMsgReceipt')
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
        case 'custom':
            nim.sendCustomMsg({
                scene: obj.scene,
                to: obj.to,
                pushContent: obj.pushContent,
                content: JSON.stringify(obj.content),
                done: onSendMsgDone
            })
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



// 发送消息已读回执
export function sendMsgReceipt({state, commit}) {
    // 如果有当前会话
    let currSessionId = store.state.currSessionId
    if (currSessionId) {
        // 只有点对点消息才发已读回执
        if (util.parseSession(currSessionId).scene === 'p2p') {
            let msgs = store.state.currSessionMsgs
            const nim = state.nim
            if (state.sessionMap[currSessionId]) {
                nim.sendMsgReceipt({
                    msg: state.sessionMap[currSessionId].lastMsg,
                    done: function sendMsgReceiptDone(error, obj) {
                        console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
                    }
                })
            }
        }
    }
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
