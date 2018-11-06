import store from '../'

import Vue from 'vue'

import {onTeamMembers} from 'teamMembers'
import {handleSysMsgs} from 'sysMsgs'


import {request_post} from "../../utils/request";


import config from '../../configs'
import util from "../../utils";
import {formatUserInfo} from "./userInfo";

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


// 收到群列表及更新群列表接口
// 同步群列表的回调, 会传入群数组
export function onTeams({type, list, team, owner}) {


    let msg

    switch (type) {


        // 创建群
        case 'createTeam':
            msg = {
                from: "创建群的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "对应的群信息",
                }
            }
            onCreateTeam(null, {team, owner})
            break;


        // 更新群
        case 'updateTeam':
            // 更新群后, 所有群成员会收到一条类型为'updateTeam'的群通知消息
            msg = {
                from: "更新群的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "被更新的群信息",
                }
            }
            onUpdateTeam(null, {list})

            break;

        // 解散群
        case 'dismissTeam':
            // 解散群后, 所有群成员会收到一条类型为'dismissTeam'的群通知消息

            msg = {
                from: "解散群的人的帐号",
                to: "对应的群ID",
            }

            onDismissTeam(null, {team})

            break;
        // 更新群成员禁言状态
        case 'updateTeamMute':
            // 更新群成员禁言状态后, 所有群成员会收到一条类型为'updateTeamMute'的群通知消息

            msg = {
                from: "操作方",
                to: "对应的群ID",
                attach: {
                    team: "对应的群对象",
                    account: "被禁言的帐号",
                    members: "被禁言的群成员列表",
                }
            }
            break;

        default:
            break;


    }

    handleSysMsgs(msg)

}


// 创建群
function onCreateTeam(error, {team, owner}) {

    if (!Array.isArray(team)) {
        team = [team]
    }

    store.commit('updateTeamList', team)

    // onTeamMembers({
    //     teamId: team.teamId,
    //     members: [owner]
    // })
}


// 解散群
function onDismissTeam(error, {team}) {


    if (!Array.isArray(team)) {
        team = [team]
    }
    team = team.map(item => {
        // 标记删除
        item.valid = false
        return item
    })


    store.commit('updateTeamList', team)
}

// 更新群
function onUpdateTeam(error, {list}) {


    if (!Array.isArray(list)) {
        list = [list]
    }
    // 默认是有效的
    list.forEach(team => team.validToCurrentUser === undefined && (team.validToCurrentUser = true))


    store.commit('updateTeamList', list)

}


/*
* 暴露给前端调用的
* */

// 更新群信息
export function updateTeam({state, commit}, obj) {


    let {teamId, name, avatar, done} = obj

    request_post("updateTeam", {
        teamId,
        name,
        avatar,
    }).then(() => {
        done instanceof Function && done()
    })


}

// 创建群
export function createTeam({state, commit}, obj) {

    let {name, avatar, accounts, done} = obj

    request_post("createTeam", {
        accounts,
        name,
        avatar,

    }).then(() => {
        done instanceof Function && done(null, null)
    })

}


// 删除群
export function dismissTeam({state, commit}, {teamId, done}) {


    request_post("dismissTeam", {
        teamId,
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}


/***********************/


// 进入可配置的群信息设置页，进入前改变state中的配置信息，进入页面后读取配置信息更新视图
export function enterSettingPage({commit}, obj) {
    commit('updateTeamSettingConfig', obj)
    setTimeout(() => Vue.router.push('/teamsetting'), 0)
}


/*
* 代理操作方法
* @functionName 方法名
* @options 方法的参数
*/
export function delegateFunction({state}, {functionName, options}) {
    const sim = state.sim
    if (functionName && sim[functionName] && typeof sim[functionName] === 'function') {
        sim[functionName](options)
    } else {
        throw(`There is not property of '${functionName}' or '${functionName}' is not a function`)
    }
}

