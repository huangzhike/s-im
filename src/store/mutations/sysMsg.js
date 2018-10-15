import util from "../../utils";
import config from '../../configs'
import Vue from 'Vue'

export function updateSysMsgs(state, sysMsgs) {
    const nim = state.nim
    if (!Array.isArray(sysMsgs)) {
        sysMsgs = [sysMsgs]
    }
    sysMsgs = sysMsgs.map(msg => {
        msg.showTime = util.formatDate(msg.time, false)
        return msg
    })
    // state.sysMsgs = nim.mergeSysMsgs(state.sysMsgs, sysMsgs)
    state.sysMsgs = [].concat(nim.mergeSysMsgs(state.sysMsgs, sysMsgs))
    Vue.set(state, sysMsgs, state.sysMsgs)
}

// 更新消息的状态，如管理员批准或拒绝入群后，会收到新消息，更新入群申请的状态
export function updateSysMsgState(state, sysMsg) {
    let exitMsg = state.sysMsgs.find(msg => {
        return msg.idServer === sysMsg.idServer
    })
    if (exitMsg) {
        exitMsg.state = sysMsg.state
    }
}

export function updateSysMsgUnread(state, obj) {
    state.sysMsgUnread = Object.assign({}, obj)
}

export function resetSysMsgs(state, obj) {
    let type = obj.type
    switch (type) {
        case 0:
            state.sysMsgs = []
            break

    }
}

export function deleteSysMsgs(state, obj) {
    let type = obj.type
    let idServer = obj.idServer
    let arr = state.sysMsgs
    arr = arr.filter(msg => {
        return msg.idServer !== idServer
    })
    Vue.set(state, 'sysMsgs', arr)
}
