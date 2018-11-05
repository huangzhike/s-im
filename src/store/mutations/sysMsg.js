import util from "../../utils";
import config from '../../configs'
import Vue from 'Vue'

export function updateSysMsgs(state, sysMsgs) {

    if (!Array.isArray(sysMsgs)) {
        sysMsgs = [sysMsgs]
    }
    sysMsgs = sysMsgs.map(msg => {
        msg.showTime = util.formatDate(msg.time, false)
        return msg
    })
    // 合并消息
    state.sysMsgs = [].concat(util.mergeArrayById(state.sysMsgs, sysMsgs))
    Vue.set(state, sysMsgs, state.sysMsgs)
}


// 未读系统消息
export function updateSysMsgUnread(state, obj) {
    state.sysMsgUnread = Object.assign({}, obj)
}

// 清空系统消息
export function resetSysMsgs(state, obj) {
    state.sysMsgs = []
}

export function deleteSysMsgs(state, obj) {
    let type = obj.type
    let idServer = obj.idServer
    let arr = state.sysMsgs
    arr = arr.filter(msg => msg.idServer !== idServer)
    Vue.set(state, 'sysMsgs', arr)
}
