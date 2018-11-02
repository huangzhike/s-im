import store from '../'


import {request_post} from "../../common/request";
import util from "../../utils";


export function onSysMsgs(sysMsg) {


    switch (sysMsg.type) {

        // 对方消息撤回
        case 'deleteMsg':
            if (sysMsg.scene === 'p2p') {
                sysMsg.sessionId = `p2p-${sysMsg.from}`
            } else {
                sysMsg.sessionId = `team-${sysMsg.to}`
            }
            onRevokeMsg(null, sysMsg)
            break


    }
    store.commit('updateSysMsgState', sysMsg)
}

// 未读系统消息
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


// 清空系统消息
export function resetSysMsgs({state, commit}, obj) {
    commit('resetSysMsgs', obj)
}

// 删除系统消息
export function deleteSysMsgs({commit}, obj) {
    commit('deleteSysMsgs', obj)
}


// 消息撤回回调
function onRevokeMsg(error, msg) {

    if (error) {
        error.code === 508 ? console.error('发送时间超过2分钟的消息，不能被撤回') : console.error(error)
        return
    }
    let tip = ''
    if (msg.from === store.state.userUID) {
        tip = '你撤回了一条消息'
    } else {
        let userInfo = store.state.userInfos[msg.from]
        tip = userInfo ? `${util.getFriendAlias(userInfo)}撤回了一条消息` : '对方撤回了一条消息'

    }
    // 收到服务器应答后发送给对方并删除消息

    // todo
    state.sim.send({
        type: "sendTipMsg",
        isLocal: true,
        scene: msg.scene,
        to: msg.to,
        tip,
        time: msg.time,
    }, () => {
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
    })


}

// 撤回消息
export function revokeMsg({state, commit}, msg) {

    let {idClient} = msg
    msg = Object.assign(msg, state.msgsMap[idClient])


    state.sim.send({
        type: "deleteMsg",
        msg
    }, null)


}

export function handleSysMsgs(sysMsgs) {
    (!Array.isArray(sysMsgs)) && (sysMsgs = [sysMsgs])

    sysMsgs.forEach(sysMsg => {

        switch (sysMsg.type) {
            case 'addFriend':

                break;
            case 'applyFriend':
                break;
            case 'passFriendApply':

                break;
            case 'rejectFriendApply':
                break;
            case 'deleteFriend':

                break;
            /*****/
            case 'createTeam':
                break;
            case 'updateTeam':
                break;
            case 'dismissTeam':
                break;

            case 'updateTeamMute':
                break;


            /*****/
            case 'addTeamMembers':
                break;
            case 'teamInvite':
                break;
            case 'acceptTeamInvite':
                break;

            case 'rejectTeamInvite':
                break;

            case 'applyTeam':
                break;
            case 'passTeamApply':
                break;

            case 'rejectTeamApply':
                break;

            case 'leaveTeam':
                break;
            case 'removeTeamMembers':
                break;


            case 'addTeamManagers':
                break;
            case 'removeTeamManagers':
                break;


            /*****/
            default:
                break;
        }
    });


    store.commit('updateSysMsgs', sysMsgs)
}
