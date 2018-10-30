import store from '../'


import {request_post} from "../../common/request";
import {onDeleteFriend} from "./friends";


let team = {

    // 群Id
    teamId: "",
    // 群类型
    type: "normal" || "advanced",
    // 群名字
    name: "",
    // 群头像
    avatar: "",
    // 群简介
    intro: "",
    // 群公告
    announcement: "",
    // 群加入方式 不需要验证 需要验证 禁止任何人加入
    joinMode: "noVerify" || "needVerify" || "rejectAll",
    // 群被邀请模式 需要邀请方同意 不需要邀请方同意
    beInviteMode: "needVerify" || "noVerify",
    // 群邀请模式 只有管理员/群主可以邀请他人入群 所有人可以修改
    inviteMode: "manager" || "all",
    // 群信息修改权限
    updateTeamMode: "manager" || "all",
    // 群信息自定义字段修改权限
    updateCustomMode: "manager" || "all",
    // 群主
    owner: "",
    // 群人数上限
    level: "",
    // 群成员数量
    memberNum: "",
    // 群成员最后更新时间
    memberUpdateTime: "",
    // 群创建时间
    createTime: "",
    // 群最后更新时间
    updateTime: "",
    // 第三方扩展字段, 开发者可以自行扩展, 建议封装成JSON格式字符串
    custom: "",
    // 第三方服务器扩展字段, 开发者可以自行扩展, 建议封装成JSON格式字符串
    serverCustom: "",
    // 是否有效, 解散后该群无效
    valid: "",
    // 该群是否对当前用户有效, 如果无效, 那么说明被踢了
    validToCurrentUser: "",
    // 是否禁言, 禁言状态下成员不能发送消息
    mute: "",
    // 禁言类型 都不禁言 普通成员禁言，即普通成员不能发消息 全体禁言，即所有成员均不能发消息
    muteType: "none" || "normal" || "all"

}


let teamMember = {
    // 群ID
    teamId: "",
    // 帐号
    account: "",
    // 群成员类型 普通成员 群主 管理员
    type: 'normal' || 'owner' || 'manager',
    // 在群里面的昵称
    nickInTeam: "",
    // 普通群拉人进来的时候, 被拉的人处于未激活状态, 未激活状态下看不到这个群, 当有人说话后自动转为激活状态, 能看到该群
    active: "",
    // 入群时间
    joinTime: "",
    // 更新时间
    updateTime: "",

}


// 收到群列表及更新群列表接口
// 同步群列表的回调, 会传入群数组
export function onTeams({list}) {
    if (!Array.isArray(list)) {
        list = [list]
    }
    // 默认是有效的
    list.forEach(team => team.validToCurrentUser === undefined && (team.validToCurrentUser = true))
    store.commit('updateTeamList', list)
}

// 收到群成员及更新群成员接口
export function onTeamMembers(obj) {
    store.commit('updateTeamMembers', obj)
}

export function onCreateTeam({team, owner}) {
    onTeams({list: team})
    onTeamMembers({
        teamId: team.teamId,
        members: [owner]
    })
}

export function onSynCreateTeam(team) {
    onTeams({list: team})
}

export function onDismissTeam(obj) {
    store.commit('updateTeamList', {
        invalid: {teamId: obj.teamId}
    })
}

export function onUpdateTeam(team) {
    onTeams({list: team})
}

export function onTeamNotificationMsg({state, commit}, msg) {
    if (msg.attach.type === 'updateTeam' && msg.attach.team) {
        store.commit('updateTeamInfo', msg.attach.team)
    }
    if (msg.attach.type === 'transferTeam') {
        onTeamMembers({
            teamId: msg.attach.team.teamId,
            members: msg.attach.members
        })
    }
}

export function onAddTeamMembers(obj) {
    obj.accounts.forEach(account => {
        // 自己被拉入群时更新群列表
        if (account === store.state.userUID) {
            let team = [obj.team]
            onTeams({list: team})
        }
    })
    onTeamMembers({
        teamId: obj.team.teamId,
        members: obj.members
    })
}

export function onRemoveTeamMembers(obj) {
    obj.accounts.forEach(account => {
        // 自己被移出群时，更新群列表
        if (account === store.state.userUID) {
            obj.team.validToCurrentUser = false
            let team = [obj.team]
            onTeams({list: team})
        }
    })
    store.commit('removeTeamMembersByAccounts', {
        teamId: obj.team.teamId,
        accounts: obj.accounts
    })
}

export function onUpdateTeamMember(teamMember) {
    onTeamMembers({
        teamId: teamMember.teamId,
        members: teamMember
    })
}


export function onUpdateTeamManagers(obj) {
    onTeamMembers({
        teamId: obj.team.teamId,
        members: obj.members
    })
}


// 进入可配置的群信息设置页，进入前改变state中的配置信息，进入页面后读取配置信息更新视图
export function enterSettingPage({commit}, obj) {
    commit('updateTeamSettingConfig', obj)
    setTimeout(() =>
            location.href = `#/teamsetting`
        , 20)
}


/*
* 代理nim sdk中对群组的操作方法
* @functionName  sim sdk中的方法名
* @options 传递给sdk方法的参数
*/
export function delegateTeamFunction({state}, {functionName, options}) {
    const sim = state.sim
    if (functionName && sim[functionName] && typeof sim[functionName] === 'function') {
        sim[functionName](options)
    } else {
        throw(`There is not property of '${functionName}' in sim or '${functionName}' is not a function`)
    }
}

export function getTeamMembers({state}, teamId) {
    const sim = state.sim
    if (!sim) {
        // 防止nim未初始化
        setTimeout(() => {
            getTeamMembers(store, teamId)
        }, 200);
        return
    }


    request_post("getTeamMembers", {
        teamId
    }).then(resp => {
        // todo
        if (resp.data.members) {
            onTeamMembers({
                teamId: resp.data.teamId,
                members: resp.data.members
            })
        } else {
            setTimeout(() => {
                getTeamMembers(store, teamId)
            }, 200);
        }

    }).catch(err => {
    })

}


export function getTeamMsgReads({state}, needQuery) {


    request_post("getTeamMsgReads", {}).then(resp => {
        // todo
        console.log('获取群组消息已读：', resp.data)
        store.commit('updateTeamMsgReads', resp.data)

    }).catch(err => {
    })

}
