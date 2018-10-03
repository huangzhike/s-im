import store from '../'
import {onUpdateFriend, onDeleteFriend} from './friends'
import {onRevocateMsg} from './msgs'

/*

系统通知对象有以下字段

time: 时间戳
type: 系统通知类型, 自定义系统通知无此字段
from: 系统通知的来源, 账号或者群ID
to: 系统通知的目标, 账号或者群ID
idServer: 内建系统通知的 idServer
read: 内建系统通知是否已读
category: 内建系统通知种类
state: 内建系统通知状态
error: 内建系统通知的状态为 'error' 时, 此字段包含错误的信息
localCustom: 内建系统通知的本地自定义扩展字段
在支持数据库时可以调用更新本地会话来更新此字段, 此字段只会被更新到本地数据库, 不会被更新到服务器上
ps: 内建系统通知的附言
attach: 内建系统通知的附加信息, 参考系统通知类型来查看不同类型的系统通知对应的附加信息
scene: 自定义系系统通知的场景, 参考消息场景
content: 自定义系统通知的内容
isPushable: 是否需要推送
apnsText: 自定义系统通知的apns推送文案, 仅对接收方为iOS设备有效
pushPayload: 自定义系统通知的推送属性
推荐使用JSON格式构建, 非JSON格式的话, Web端会正常接收, 但是会被其它端丢弃
needPushNick: 是否需要推送昵称
sendToOnlineUsersOnly: 自定义系统通知是否只发送给在线用户。
true时只发送给在线用户, 适合发送即时通知, 比如正在输入。
false时假如目标用户或群不在线, 会在其上线后推送过去。
该参数只对点对点自定义系统通知有效, 对群自定义系统通知无效, 群自定义系统通知只会发给在线的群成员, 不会存离线。
cc: 自定义系统通知是否抄送


*/

/*


系统通知类型
系统通知对象有一个字段type来标明系统通知的类型, 自定义系统通知无此字段, 具体类型如下

'teamInvite' (入群邀请)
高级群的群主和管理员在邀请成员加入群（通过操作创建群或拉人入群）之后, 被邀请的人会收到一条类型为'teamInvite'的系统通知, 此类系统通知的from字段的值为邀请方的帐号, to字段的值为对应的群ID, 此类系统通知的attach有一个字段team的值为被邀请进入的群, 被邀请的人可以选择接受邀请或者拒绝邀请。
如果接受邀请, 那么该群的所有群成员会收到一条类型为'acceptTeamInvite'的群通知消息, 此类群通知消息的from字段的值为接受入群邀请的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段members的值为接收入群邀请的群成员列表。
如果拒绝邀请, 那么邀请你的人会收到一条类型为'rejectTeamInvite'的系统通知, 此类系统通知的from字段的值为拒绝入群邀请的用户的帐号, to字段的值为对应的群ID。
'rejectTeamInvite' (拒绝入群邀请)
见'teamInvite'
'applyTeam' (入群申请)
用户可以申请加入高级群, 目标群的群主和管理员会收到一条类型为'applyTeam'的系统通知, 此类系统通知的from字段的值为申请方的帐号, to字段的值为对应的群ID, 高级群的群主和管理员在收到入群申请后, 可以选择通过或者拒绝入群申请。
如果通过申请, 那么该群的所有群成员会收到一条类型为'passTeamApply'的群通知消息, 此类群通知消息的from字段的值为通过入群申请的人的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群对象, attach有一个字段account的值为申请方的帐号, attach有一个字段members的值为被通过申请的群成员列表。
如果拒绝申请, 那么申请人会收到一条类型为'rejectTeamApply'的系统通知, 此类系统通知的from字段的值为拒绝方的帐号, to字段的值为对应的群ID, attach有一个字段team的值为对应的群。
'rejectTeamApply' (拒绝入群申请)
见'applyTeam'
'addFriend'
直接加某个用户为好友后, 对方不需要确认, 直接成为当前登录用户的好友
对方会收到一条类型为'addFriend'的系统通知, 此类系统通知的from字段的值为申请方的帐号, to字段的值为接收方的账号。
'applyFriend'
申请加某个用户为好友后, 对方会收到一条类型为'applyFriend'的系统通知, 此类系统通知的from字段的值为申请方的帐号, to字段的值为接收方的账号, 用户在收到好友申请后, 可以选择通过或者拒绝好友申请。
如果通过好友申请, 那么申请方会收到一条类型为'passFriendApply'的系统通知, 此类系统通知的from字段的值为通过方的帐号, to字段的值为申请方的账号。
如果拒绝好友申请, 那么申请方会收到一条类型为'rejectFriendApply'的系统通知, 此类系统通知的from字段的值为拒绝方的帐号, to字段的值为申请方的账号。
'passFriendApply'
见 'applyFriend'
'rejectFriendApply'
见 'applyFriend'
'deleteFriend'
删除好友后, 被删除的人会收到一条类型为'deleteFriend'的系统通知, 此类系统通知的from字段的值为删除方的帐号, to字段的值为被删除方的账号。
'deleteMsg'
撤回消息后, 消息接收方会收到一条类型为'deleteMsg'的系统通知, 此类系统通知的 msg 为被删除的消息的部分字段。如果是群消息, 那么群里的所有人都会收到这条系统通知. 如果同时在多个端登录了同一个账号, 那么其它端也会收到这条系统通知.
'custom'
自定义系统通知



*/







export function onSysMsgs(sysMsgs) {
    store.commit('updateSysMsgs', sysMsgs)
}

export function onSysMsg(sysMsg) {
/*
    friend: 所有跟好友相关的系统通知的未读数
    addFriend: 直接加为好友的未读数
    applyFriend: 申请加为好友的未读数
    passFriendApply: 通过好友申请的未读数
    rejectFriendApply: 拒绝好友申请的未读数
    deleteFriend: 删除好友的未读数
    team: 所有跟群相关的系统通知的未读数
    teamInvite: 入群邀请的未读数
    rejectTeamInvite: 接受入群邀请的未读数
    applyTeam: 入群申请的未读数
    rejectTeamApply: 拒绝入群申请的未读数
    deleteMsg: 撤回消息的未读数
    */

    switch (sysMsg.type) {
        // 在其他端添加或删除好友
        case 'addFriend':
            onUpdateFriend(null, {
                account: sysMsg.from
            })
            store.commit('updateSysMsgs', [sysMsg])
            break
        case 'deleteFriend':
            onDeleteFriend(null, {
                account: sysMsg.from
            })
            break
        // 对方消息撤回
        case 'deleteMsg':
            if (sysMsg.scene === 'p2p') {
                sysMsg.sessionId = `p2p-${sysMsg.from}`
            } else {
                sysMsg.sessionId = `team-${sysMsg.to}`
            }
            onRevocateMsg(null, sysMsg)
            break
        case 'teamInvite': //被邀请入群
        case 'applyTeam':  // 申请入群
        case 'rejectTeamApply':  // 申请入群被拒绝
        case 'rejectTeamInvite': // 拒绝入群邀请
            store.commit('updateSysMsgs', [sysMsg])
            break
    }
    store.commit('updateSysMsgState', sysMsg)
}

export function onSysMsgUnread(obj) {
    store.commit('updateSysMsgUnread', obj)
}

// 不传obj则全部重置
export function markSysMsgRead({state, commit}, obj) {
    const nim = state.nim
    let sysMsgs = []
    if (obj && obj.sysMsgs) {
        sysMsgs = obj.sysMsgs
    } else {
        sysMsgs = state.sysMsgs
    }
    if (Array.isArray(sysMsgs) && sysMsgs.length > 0) {
        nim.markSysMsgRead({
            sysMsgs,
            done: function (error, obj) {
            }
        })
    }
}


export function resetSysMsgs({state, commit}, obj) {
    commit('resetSysMsgs', obj)
}

export function deleteSysMsgs({commit}, obj) {
    commit('deleteSysMsgs', obj)
}

//
// function handleSysMsgs(sysMsgs) {
//     if (!Array.isArray(sysMsgs)) {sysMsgs=[sysMsgs];}
//     sysMsgs.forEach(function(sysMsg) {
//         var idServer = sysMsg.idServer;
//         switch (sysMsg.type) {
//             case 'addFriend':
//                 onAddFriend(sysMsg.friend);
//                 break;
//             case 'applyFriend':
//                 break;
//             case 'passFriendApply':
//                 onAddFriend(sysMsg.friend);
//                 break;
//             case 'rejectFriendApply':
//                 break;
//             case 'deleteFriend':
//                 onDeleteFriend(sysMsg.from);
//                 break;
//             case 'applyTeam':
//                 break;
//             case 'rejectTeamApply':
//                 break;
//             case 'teamInvite':
//                 break;
//             case 'rejectTeamInvite':
//                 break;
//             default:
//                 break;
//         }
//     });
// }
