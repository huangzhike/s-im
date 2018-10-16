import store from '../'
import cookie from '../../utils/cookie'
import util from '../../utils'
import config from '../../configs'
import Vue from 'Vue'


import {updateFullscreenImage, updateLoading} from './widgetUi'

import {updateMyInfo, updateUserInfo} from './userInfo'

import {
    updateTeamInfo,
    updateTeamList,
    updateTeamMembers,
    updateTeamSettingConfig,
    removeTeamMembersByAccounts
} from './team'
import {updateSysMsgs, updateSysMsgState, updateSysMsgUnread, resetSysMsgs, deleteSysMsgs} from './sysMsg'


import {updateCurrSessionId, updateCurrSessionMsgs, updateSessions, deleteSessions} from './session'

import {updateSearchlist} from './search'
import {updateFriends} from './friend'
import {
    updateMsgByIdClient,
    updateMsgs,
    putMsg,
    replaceMsg,
    deleteMsg,
    setNoMoreHistoryMsgs,
    resetNoMoreHistoryMsgs
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
