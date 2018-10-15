// 初始化，收到离线漫游消息时调用
import store from "../index";
import config from '../../configs'
import Vue from 'Vue'

export function updateMsgs(state, msgList) {
    const nim = state.nim
    let tempSessionMap = {}
    msgList.forEach(msg => {
        let sessionId = msg.sessionId
        tempSessionMap[sessionId] = true
        if (!state.msgs[sessionId]) {
            state.msgs[sessionId] = []
        }
        // sdk会做消息去重
        state.msgs[sessionId] = nim.mergeMsgs(state.msgs[sessionId], [msg])
        // state.msgs[sessionId].push(msg)
    })
    store.commit('updateMsgByIdClient', msgList)
    for (let sessionId in tempSessionMap) {
        state.msgs[sessionId].sort((a, b) => {
            return a.time - b.time
        })
        if (sessionId === state.currSessionId) {
            store.commit('updateCurrSessionMsgs', {
                type: 'init'
            })
        }
    }
}

// 更新追加消息，追加一条消息
export function putMsg(state, msg) {
    let sessionId = msg.sessionId
    if (!state.msgs[sessionId]) {
        state.msgs[sessionId] = []
    }
    store.commit('updateMsgByIdClient', msg)
    let tempMsgs = state.msgs[sessionId]
    let lastMsgIndex = tempMsgs.length - 1
    if (tempMsgs.length === 0 || msg.time >= tempMsgs[lastMsgIndex].time) {
        tempMsgs.push(msg)
    } else {
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgs[i]
            if (msg.time >= currMsg.time) {
                state.msgs[sessionId].splice(i, 0, msg)
                break
            }
        }
    }
}

// 删除消息列表消息
export function deleteMsg(state, msg) {
    let sessionId = msg.sessionId
    let tempMsgs = state.msgs[sessionId]
    if (!tempMsgs || tempMsgs.length === 0) {
        return
    }
    let lastMsgIndex = tempMsgs.length - 1
    for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = tempMsgs[i]
        if (msg.idClient === currMsg.idClient) {
            state.msgs[sessionId].splice(i, 1)
            break
        }
    }
}

// 替换消息列表消息，如消息撤回
export function replaceMsg(state, obj) {
    let {sessionId, idClient, msg} = obj
    let tempMsgs = state.msgs[sessionId]
    if (!tempMsgs || tempMsgs.length === 0) {
        return
    }
    let lastMsgIndex = tempMsgs.length - 1
    for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = tempMsgs[i]
        console.log(idClient, currMsg.idClient, currMsg.text)
        if (idClient === currMsg.idClient) {
            state.msgs[sessionId].splice(i, 1, msg)
            break
        }
    }
}

// 用idClient 更新消息，目前用于消息撤回
export function updateMsgByIdClient(state, msgList) {
    if (!Array.isArray(msgList)) {
        msgList = [msgList]
    }
    let now = (new Date()).getTime()
    msgList.forEach(msg => {
        // 有idClient 且 5分钟以内的消息
        if (msg.idClient && (now - msg.time < 1000 * 300)) {
            state.msgsMap[msg.idClient] = msg
        }
    })
}
