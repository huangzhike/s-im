import store from '../'
import cookie from '../../utils/cookie'
import util from '../../utils'
import config from '../../configs'
import Vue from 'Vue'

export default {

    updateLoading(state, status) {
        clearTimeout(state.loadingTimer)
        state.loadingTimer = setTimeout(() => state.isLoading = status, 20)
    },
    updateFullscreenImage(state, obj) {
        obj = obj || {}
        if (obj.src && obj.type === 'show') {
            state.fullscreenImgSrc = obj.src
            state.isFullscreenImgShow = true
        } else if (obj.type === 'hide') {
            state.fullscreenImgSrc = ' '
            state.isFullscreenImgShow = false
        }
    },
    updateUserUID(state, loginInfo) {
        state.userUID = loginInfo.uid
        state.sdktoken = loginInfo.sdktoken
        cookie.setCookie('uid', loginInfo.uid)
        cookie.setCookie('sdktoken', loginInfo.sdktoken)
    },
    updateMyInfo(state, myInfo) {
        state.myInfo = util.mergeObject(state.myInfo, myInfo)
    },
    updateUserInfo(state, users) {
        let userInfos = state.userInfos
        // userInfos {}
        users.forEach(user => {
            let account = user.account
            if (account) {
                userInfos[account] = util.mergeObject(userInfos[account], user)
            }
        })
        state.userInfos = util.mergeObject(state.userInfos, userInfos)
    },


    updateSearchlist(state, obj) {
        const type = obj.type
        switch (type) {
            case 'user':
                if (obj.list.length !== 0 || state.searchedUsers.length !== 0) {
                    state.searchedUsers = obj.list
                } else {
                    state.searchedUsers = []
                }
                break
            case 'team':
                if (obj.list.length !== 0 || state.searchedTeams.length !== 0) {
                    state.searchedTeams = obj.list
                } else {
                    state.searchedTeams = []
                }
                break
        }
    },

    /**************************************************************************************************************************/


    // 好友 + -
    updateFriends(state, friends, cutFriends = []) {
        const nim = state.nim
        state.friendslist = util.mergeArrayById(state.friendslist, friends)

        state.friendslist = nim.cutFriends(state.friendslist, friends.invalid)
    },

    /**************************************************************************************************************************/

    // 更新会话
    updateSessions(state, sessionList) {

        state.sessionlist = util.mergeArrayById(state.sessionlist, sessionList)
        state.sessionlist.sort((a, b) => b.updateTime - a.updateTime)
        state.sessionlist.forEach(session => state.sessionMap[session.id] = session)
    },
    // 删除会话
    deleteSessions(state, sessionIdList) {
        state.sessionlist = util.deleteArrayByIdList(state.sessionlist, sessionIdList)
    },


    // 更新当前会话id，用于唯一判定是否在current session状态
    updateCurrSessionId(state, obj) {
        let type = obj.type || ''
        if (type === 'init' && obj.sessionId) {

            state.currSessionId = obj.sessionId

        } else if (type === 'destroy') {
            state.currSessionId = null
        }
    },
    // 更新当前会话列表的聊天记录，包括历史消息、单聊消息等
    // replace: 替换idClient的消息
    updateCurrSessionMsgs(state, obj) {
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
                store.dispatch('checkTeamMsgReceipt', [newMsg])
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
            store.dispatch('checkTeamMsgReceipt', currSessionMsgs)
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
    },


    /**************************************************************************************************************************/





    // 初始化，收到离线漫游消息时调用
    updateMsgs(state, msgList) {
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
    },
    // 更新追加消息，追加一条消息
    putMsg(state, msg) {
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
    },
    // 删除消息列表消息
    deleteMsg(state, msg) {
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
    },
    // 替换消息列表消息，如消息撤回
    replaceMsg(state, obj) {
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
    },
    // 用idClient 更新消息，目前用于消息撤回
    updateMsgByIdClient(state, msgList) {
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
    },

    /**************************************************************************************************************************/


    updateSysMsgs(state, sysMsgs) {
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
    },
    // 更新消息的状态，如管理员批准或拒绝入群后，会收到新消息，更新入群申请的状态
    updateSysMsgState(state, sysMsg) {
        let exitMsg = state.sysMsgs.find(msg => {
            return msg.idServer === sysMsg.idServer
        })
        if (exitMsg) {
            exitMsg.state = sysMsg.state
        }
    },
    updateSysMsgUnread(state, obj) {
        state.sysMsgUnread = Object.assign({}, obj)
    },

    resetSysMsgs(state, obj) {
        let type = obj.type
        switch (type) {
            case 0:
                state.sysMsgs = []
                break

        }
    },
    deleteSysMsgs(state, obj) {
        let type = obj.type
        let idServer = obj.idServer
        let arr = state.sysMsgs
        arr = arr.filter(msg => {
            return msg.idServer !== idServer
        })
        Vue.set(state, 'sysMsgs', arr)
    },


    /**************************************************************************************************************************/

    setNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = true
    },
    resetNoMoreHistoryMsgs(state) {
        state.noMoreHistoryMsgs = false
    },
    /**************************************************************************************************************************/


    updateTeamList(state, teams) {
        const nim = state.nim
        store.state.teamlist = nim.mergeTeams(store.state.teamlist, teams)
        store.state.teamlist = nim.cutTeams(store.state.teamlist, teams.invalid)
    },

    updateTeamInfo(state, team) {
        let index = state.teamlist.findIndex(item => item.teamId === team.teamId)
        if (index === -1) return
        for (const key in team) {
            if (key !== 'teamId' && team.hasOwnProperty(key) && team[key]) {
                state.teamlist[index][key] = team[key]
            }
        }
    },
    updateTeamSettingConfig(state, obj) {
        state.teamSettingConfig = obj
    },

    updateTeamMembers(state, obj) {
        const nim = state.nim
        let teamId = obj.teamId
        let members = obj.members
        state.teamMembers = state.teamMembers || {}
        state.teamMembers[teamId] = nim.mergeTeamMembers(state.teamMembers[teamId], members)
        state.teamMembers[teamId] = nim.cutTeamMembers(state.teamMembers[teamId], members.invalid)

        state.teamMembers[teamId].sort((a, b) => {
            // 将群主和管理员排在队列前方
            if (a.type === 'owner' || b.type === 'owner') {
                return a.type === 'owner' ? -1 : 1
            }
            if (a.type === 'manager' || b.type === 'manager') {
                return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0
            }
            return -1
        })
        state.teamMembers = Object.assign({}, state.teamMembers)
    },

    removeTeamMembersByAccounts(state, obj) {
        let teamId = obj.teamId
        let invalidAccounts = obj.accounts
        if (state.teamMembers[teamId] === undefined) return
        state.teamMembers[teamId] = state.teamMembers[teamId].filter((member, index) => {
            return invalidAccounts.indexOf(member.account) === -1
        })
        state.teamMembers = Object.assign({}, state.teamMembers)
    },

}
