/*
 * 会话列表
 */


import {request_post} from "../../common/request";


let session = {
    // 会话ID
    id: "",
    // 场景
    scene: "",
    // 聊天对象, 账号或群ID
    to: "",
    // 会话更新的时间
    updateTime: "",
    // 未读数
    unread: "",
    // 此会话的最后一条消息
    lastMsg: "",
}


import store from '../'

// 如果会话对象不是好友，需要更新好友名片
function updateSessionAccount(sessions) {
    let accountsNeedSearch = []
    sessions.forEach(item => {
        if (item.scene === 'p2p') {
            // 如果不存在缓存资料
            if (!store.state.userInfos[item.to]) {
                accountsNeedSearch.push(item.to)
            }
        }
    })
    if (accountsNeedSearch.length > 0) {
        store.dispatch('searchUsers', {
            accounts: accountsNeedSearch
        })
    }
}

// onSessions只在初始化完成后回调
export function onSessions(sessions) {
    updateSessionAccount(sessions)
    store.commit('updateSessions', sessions)
}

export function onUpdateSession(session) {
    let sessions = [session]
    updateSessionAccount(sessions)
    store.commit('updateSessions', sessions)
}

export function deleteSession({state, commit}, sessionId) {

    sessionId = sessionId || ''
    let scene = null
    let account = null
    if (/^p2p-/.test(sessionId)) {
        scene = 'p2p'
        account = sessionId.replace(/^p2p-/, '')
    } else if (/^team-/.test(sessionId)) {
        scene = 'team'
        account = sessionId.replace(/^team-/, '')
    }
    if (account && scene) {




        request_post("deleteSession", {
            scene,
            to: account,
        }).then(resp => {
            // deleteServerSessionDone
            commit('deleteSessions', [sessionId])
            // deleteLocalSessionDone
        }).catch(err => {
        })



    }
}

export function setCurrSession({state, commit, dispatch}, sessionId) {
    const nim = state.nim
    if (sessionId) {
        commit('updateCurrSessionId', {
            type: 'init',
            sessionId
        })
        if (nim) {
            // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
            nim.setCurrSession(sessionId)
            commit('updateCurrSessionMsgs', {
                type: 'init',
                sessionId
            })
            // 发送已读回执
            dispatch('sendMsgReceipt')
        }
    }
}

export function resetCurrSession({state, commit}) {
    const nim = state.nim
    nim.resetCurrSession()
    commit('updateCurrSessionMsgs', {
        type: 'destroy'
    })
}
