// 初始化，收到离线漫游消息时调用
import store from "../index";
import config from '../../configs'


export function updateMsgs(state, msgList) {

    let tempSessionMap = {}
    msgList.forEach(msg => {
        let sessionId = msg.sessionId
        tempSessionMap[sessionId] = true
        // 没有就新建一个会话
        if (!state.msgs[sessionId]) {
            state.msgs[sessionId] = []
        }
        // todo 消息要去重
        state.msgs[sessionId].push(msg)
    })

    // 收到消息先处理一下
    store.commit('updateMsgByIdClient', msgList)

    for (let sessionId in tempSessionMap) {
        // 时间排序
        state.msgs[sessionId].sort((a, b) =>  a.time - b.time )
        // 更新一下当前会话消息
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
    // 新会话
    if (!state.msgs[sessionId]) {
        state.msgs[sessionId] = []
    }
    // 收到消息先处理一下
    store.commit('updateMsgByIdClient', msg)

    let tempMsgList = state.msgs[sessionId]
    let lastMsgIndex = tempMsgList.length - 1
    // 如果是最后一条消息之后的消息就push进去
    if (tempMsgList.length === 0 || msg.time >= tempMsgList[lastMsgIndex].time) {
        tempMsgList.push(msg)
    } else {
        // 不然的话就更新旧的消息
        for (let i = lastMsgIndex; i >= 0; i--) {
            let currMsg = tempMsgList[i]
            // 说明比较新
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
    let tempMsgList = state.msgs[sessionId]
    if (!tempMsgList || tempMsgList.length === 0) {
        return
    }
    let lastMsgIndex = tempMsgList.length - 1
    for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = tempMsgList[i]
        if (msg.idClient === currMsg.idClient) {
            state.msgs[sessionId].splice(i, 1)
            break
        }
    }
}

// 替换消息列表消息，如消息撤回
export function replaceMsg(state, obj) {
    let {sessionId, idClient, msg} = obj

    // 该会话的消息
    let tempMsgList = state.msgs[sessionId]
    // 没有直接返回
    if (!tempMsgList || tempMsgList.length === 0) {
        return
    }
    // 最后一条消息的索引
    let lastMsgIndex = tempMsgList.length - 1
    // 根据 id 替换消息
    for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = tempMsgList[i]
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
        if (msg.idClient && (now - msg.time < 1000 * 60 * 5)) {
            // 替换消息
            state.msgsMap[msg.idClient] = msg
        }
    })
}

// 没有更多历史消息
export function setNoMoreHistoryMsgs(state) {
    state.noMoreHistoryMsg = true
}

// 重置默认
export function resetNoMoreHistoryMsgs(state) {
    state.noMoreHistoryMsg = false
}
