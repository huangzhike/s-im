import cookie from '../../utils/cookie'


import {updateFullscreenImage, updateLoading} from './widgetUi'

import {updateMyInfo, updateUserInfo} from './userInfo'

import {updateTeamInfo, updateTeamList, updateTeamSettingConfig,} from './team'

import {removeTeamMembersByAccounts, updateTeamMembers} from './teamMembers'
import {deleteSysMsgs, resetSysMsgs, updateSysMsgs, updateSysMsgState, updateSysMsgUnread} from './sysMsg'


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


export default {


    updateUserUID(state, loginInfo) {
        state.userUID = loginInfo.uid
        state.token = loginInfo.token
        cookie.setCookie('uid', loginInfo.uid)
        cookie.setCookie('token', loginInfo.token)
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
    updateSysMsgState,
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
