import util from "../../utils";
import store from "../index";
import config from "../../configs";

import Vue from 'Vue'

// 更新会话
export function updateSessions(state, sessionList) {

    state.sessionlist = util.mergeArrayById(state.sessionlist, sessionList)
    state.sessionlist.sort((a, b) => b.updateTime - a.updateTime)
    state.sessionlist.forEach(session => state.sessionMap[session.id] = session)
}

// 删除会话
export function deleteSessions(state, sessionIdList) {
    state.sessionlist = util.deleteArrayByIdList(state.sessionlist, sessionIdList)
}


// 更新当前会话id，用于唯一判定是否在current session状态
export function updateCurrSessionId(state, obj) {
    let type = obj.type || ''
    if (type === 'init' && obj.sessionId) {

        state.currSessionId = obj.sessionId

    } else if (type === 'destroy') {
        state.currSessionId = null
    }
}

// 更新当前会话列表的聊天记录，包括历史消息、单聊消息等
// replace: 替换idClient的消息
export function updateCurrSessionMsgs(state, obj) {
    let type = obj.type || ''
    if (type === 'destroy') { // 清空会话消息
        state.currSessionMsgs = []
        state.currSessionLastMsg = null
        store.commit('updateCurrSessionId', {
            type: 'destroy'
        })
    } else if (type === 'init') { // 初始化会话消息列表
        if (state.currSessionId) {
            let sessionId = state.currSessionId
            let currSessionMsgs = [].concat(state.msgs[sessionId] || [])
            // 消息截断 数量限制
            let limit = config.localMsglimit
            let msgLen = currSessionMsgs.length
            if (msgLen - limit > 0) {
                // 当前会话最后一条消息
                state.currSessionLastMsg = currSessionMsgs[msgLen - limit]
                currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen)
            } else if (msgLen > 0) {
                state.currSessionLastMsg = currSessionMsgs[0]
            } else {
                state.currSessionLastMsg = null
            }
            state.currSessionMsgs = []
            let lastMsgTime = 0
            currSessionMsgs.forEach(msg => {
                // 类似排序 大于五分钟
                if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                    lastMsgTime = msg.time
                    // 给个时间tip
                    state.currSessionMsgs.push({
                        type: 'timeTag',
                        text: util.formatDate(msg.time, false)
                    })
                }
                state.currSessionMsgs.push(msg)
            })
            // 这里可以设置群消息已读
        }
    } else if (type === 'put') { // 追加一条消息
        let newMsg = obj.msg
        let lastMsgTime = 0
        let lenCurrMsgs = state.currSessionMsgs.length
        if (lenCurrMsgs > 0) {
            lastMsgTime = state.currSessionMsgs[lenCurrMsgs - 1].time
        }
        if (newMsg) {
            if ((newMsg.time - lastMsgTime) > 1000 * 60 * 5) {
                state.currSessionMsgs.push({
                    type: 'timeTag',
                    text: util.formatDate(newMsg.time, false)
                })
            }
            state.currSessionMsgs.push(newMsg)
            // 这里可以设置群消息已读
        }
    } else if (type === 'concat') {
        // 一般用于历史消息拼接
        let currSessionMsgs = []
        let lastMsgTime = 0
        obj.msgs.forEach(msg => {
            if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                lastMsgTime = msg.time
                currSessionMsgs.push({
                    type: 'timeTag',
                    text: util.formatDate(msg.time, false)
                })
            }
            currSessionMsgs.push(msg)
        })
        currSessionMsgs.reverse()
        currSessionMsgs.forEach(msg => {
            state.currSessionMsgs.unshift(msg)
        })
        if (obj.msgs[0]) {
            state.currSessionLastMsg = obj.msgs[0]
        }
        // 这里可以设置群消息已读
    } else if (type === 'replace') {
        let msgLen = state.currSessionMsgs.length
        let lastMsgIndex = msgLen - 1
        if (msgLen > 0) {
            for (let i = lastMsgIndex; i >= 0; i--) {
                if (state.currSessionMsgs[i].idClient === obj.idClient) {
                    state.currSessionMsgs.splice(i, 1, obj.msg)
                    break
                }
            }
        }
    }
}
