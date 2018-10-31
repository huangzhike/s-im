import store from '../'
import {onUpdateFriend, onDeleteFriend} from './friends'
import {onRevocateMsg} from './msgs'


import {request_post} from "../../common/request";


export function onSysMsgs(sysMsg) {
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

    let sysMsgList = []
    if (obj && obj.sysMsgs) {
        sysMsgList = obj.sysMsgs
    } else {
        sysMsgList = state.sysMsgs
    }
    if (Array.isArray(sysMsgList) && sysMsgList.length > 0) {

        request_post("markSysMsgRead", {
            sysMsgList,
        }).then(resp => {
            // todo
        }).catch(err => {
        })

    }
}


export function resetSysMsgs({state, commit}, obj) {
    commit('resetSysMsgs', obj)
}

export function deleteSysMsgs({commit}, obj) {
    commit('deleteSysMsgs', obj)
}


export function handleSysMsgs(sysMsgs) {
    (!Array.isArray(sysMsgs)) && (sysMsgs = [sysMsgs])

    sysMsgs.forEach(function (sysMsg) {

        switch (sysMsg.type) {
            // case 'addFriend':
            //     onAddFriend(sysMsg.friend);
            //     break;
            // case 'applyFriend':
            //     break;
            // case 'passFriendApply':
            //     onAddFriend(sysMsg.friend);
            //     break;
            // case 'rejectFriendApply':
            //     break;
            // case 'deleteFriend':
            //     onDeleteFriend(sysMsg.from);
            //     break;
            // case 'applyTeam':
            //     break;
            // case 'rejectTeamApply':
            //     break;
            // case 'teamInvite':
            //     break;
            // case 'rejectTeamInvite':
            //     break;
            default:
                break;
        }
    });
}
