

import {updateFullscreenImage, updateLoading} from './widgetUi'

import {updateMyInfo, updateUserInfo} from './userInfo'

import {updateTeamInfo, updateTeamList, updateTeamSettingConfig,} from './team'

import {removeTeamMembersByAccounts, updateTeamMembers} from './teamMemberMap'
import {deleteSysMsgs, resetSysMsgs, updateSysMsgs, updateSysMsgUnread} from './sysMsg'


import {deleteSessions, updateCurrSessionId, updateCurrSessionMsgs, updateSessions} from './session'

import {updateSearchlist} from './search'
import {updateFriends} from './friend'
import {
    deleteMsg,
    putMsg,
    replaceMsg,
    resetNoMoreHistoryMsgs,
    setNoMoreHistoryMsgs,
    updateMsgByIdClient,
    updateMsgs
} from './msg'


import config from '../../configs'

export default {


    updateUserUID(state, loginInfo) {
        state.userUID = loginInfo.uid
        state.token = loginInfo.token
        state.gateList = loginInfo.gateList


        window.sessionStorage.setItem(config.constant.uid, loginInfo.uid)
        window.sessionStorage.setItem(config.constant.token, loginInfo.token)
        window.sessionStorage.setItem(config.constant.gateList,loginInfo.gateList)

    },


    updateFullscreenImage,
    updateLoading,

    updateMyInfo,
    updateUserInfo,


    updateTeamInfo,
    updateTeamList,
    updateTeamMembers,
    updateTeamSettingConfig,
    removeTeamMembersByAccounts,
    updateSysMsgs,

    updateSysMsgUnread,
    resetSysMsgs,
    deleteSysMsgs,
    updateCurrSessionId,
    updateCurrSessionMsgs,
    updateSessions,
    deleteSessions,
    updateSearchlist,
    updateFriends,
    updateMsgByIdClient,
    updateMsgs,
    putMsg,
    replaceMsg,
    deleteMsg,
    setNoMoreHistoryMsgs,
    resetNoMoreHistoryMsgs


}
