import store from "../index";
import {onTeams} from "./team";
import {request_post} from "../../utils/request";
import config from "../../configs";
import {handleSysMsgs} from "./sysMsgs";


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


// 收到群成员及更新群成员接口
export function onTeamMembers(obj) {

    let msg = null

    switch (obj.type) {

        /**********************/

        // 拉人入群
        case 'addTeamMembers':

            // 拉人入群后, 所有群成员会收到一条类型为'addTeamMembers'的群通知消息
            msg = {
                from: "拉人的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "对应的群对象",
                    accounts: "被拉的人的帐号列表",
                    members: "被拉的群成员列表",
                }
            }

            onAddTeamMembers(obj)
            break;

        /**********************/

        // 被邀请入群
        case 'teamInvite':
            // 邀请成员加入群（创建群或拉人入群）后, 被邀请的人会收到一条类型为'teamInvite'的系统通知，可以选择接受或者拒绝
            msg = {
                from: "拉人的人的帐号",
                to: "被拉的人的帐号",
                attach: {
                    team: "对应的群对象",
                }
            }
            break;

        // 接受入群邀请
        case 'acceptTeamInvite':

            // 如果接受邀请, 该群的所有群成员会收到一条类型为'acceptTeamInvite'的群通知消息,
            msg = {
                from: "接受入群邀请的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "被邀请进入的群",
                    member: "接收入群邀请的群成员"

                }
            }

            onAddTeamMembers(obj)
            break;


        // 拒绝入群邀请
        case 'rejectTeamInvite':
            // 如果拒绝邀请, 邀请你的人会收到一条类型为'rejectTeamInvite'的系统通知
            msg = {
                from: "拒绝入群邀请的用户的帐号",
                to: "发送邀请的人的帐号",

            }
            break;



        /**********************/

        // 申请入群
        case 'applyTeam':
            // 用户申请入群, 群主和管理员会收到一条类型为'applyTeam'的系统通知, 收到入群申请后, 可以选择通过或者拒绝
            msg = {
                from: "发出申请用户的帐号",
                to: "接受申请的帐号",

            }
            break;



        // 通过入群申请
        case 'passTeamApply':

            // 如果通过申请, 所有群成员会收到一条类型为'passTeamApply'的群通知消息,

            msg = {
                from: "通过入群申请的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "被邀请进入的群",
                    account: "申请方的帐号"
                }
            }
            onAddTeamMembers(obj)

            break;



        // 申请入群被拒绝
        case 'rejectTeamApply':
            // 如果拒绝申请, 申请人会收到一条类型为'rejectTeamApply'的系统通知

            msg = {
                from: "拒绝方的帐号",
                to: "申请人的账号",
                attach: {
                    team: "对应的群",
                }
            }

            break;

        /**********************/

        // 主动退群
        case 'leaveTeam':
            // 主动退群后, 所有群成员会收到一条类型为'leaveTeam'的群通知消息
            msg = {
                from: "退群的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "对应的群对象",

                }
            }

            onRemoveTeamMembers(obj)
            break;

        // 踢人出群
        case 'removeTeamMembers':


            // 踢人出群后, 所有群成员会收到一条类型为'removeTeamMembers'的群通知消息
            msg = {
                from: "踢人的人的帐号",
                to: "对应的群ID",
                attach: {
                    team: "对应的群对象",
                    accounts: "被踢的人的帐号列表",
                }
            }

            onRemoveTeamMembers(obj)
            break;


        // 添加群管理员
        case 'addTeamManagers':

            // 添加群管理员后, 所有群成员会收到一条类型为'addTeamManagers'的群通知消息
            msg = {
                from: "添加群管理员的人的帐号",
                to: "对应的群ID",
                attach: {
                    accounts: "被加为管理员的帐号列表",
                    members: "被加为管理员的群成员列表",
                }
            }

            onUpdateTeamManagers(obj)
            break;

        // 移除群管理员
        case 'removeTeamManagers':
            // 移除群管理员后, 所有群成员会收到一条类型为'removeTeamManagers'的群通知消息
            msg = {
                from: "移除群管理员的人的帐号",
                to: "对应的群ID",
                attach: {
                    accounts: "被移除的管理员的帐号列表",
                    members: "被移除管理员的群成员列表",
                }
            }

            onUpdateTeamManagers(obj)

            break;
        default:
            msg = {}
            break;
    }


    handleSysMsgs(msg)
}


// 群成员添加
function onAddTeamMembers(obj) {
    obj.accounts.forEach(account => {
        // 自己被拉入群时更新群列表
        if (account === store.state.userUID) {
            let team = [obj.team]
            onTeams({list: team})
        }
    })


    store.commit('updateTeamMembers', obj.list)

}

// 群成员删除
function onRemoveTeamMembers(obj) {
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

// 更新群成员
function onUpdateTeamMember(obj) {
}

// 更新群管理员
function onUpdateTeamManagers(obj) {

}


/*
* 前端真jb烦
* */

// 拉人入群
export function addTeamMembers({state, commit}, obj) {

    let {teamId, accounts, done} = obj

    request_post('addTeamMembers', {
        teamId, accounts
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}

// 邀请入群
export function inviteTeam({state, commit}, obj) {
    let {teamId, accounts, done} = obj

    request_post('inviteTeam', {
        teamId, accounts
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })

}

// 被邀请入群是否同意
export function teamInvite({state, commit}, obj) {
    let {teamId, agree, account, done} = obj

    request_post('teamInvite', {
        teamId, agree, account
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}

// 申请入群
export function applyTeam({state, commit}, obj) {

    let {teamId, account, done} = obj

    request_post('applyTeam', {
        teamId, account
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}


// 是否同意申请入群
export function teamApply({state, commit}, obj) {

    let {teamId, account, agree, done} = obj

    request_post('teamApply', {
        teamId, agree, account
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}


// 主动退群
export function leaveTeam({state, commit}, obj) {

    let {teamId, done} = obj

    request_post('leaveTeam', {
        teamId
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}

// 删除群成员
export function removeTeamMembers({state, commit}, obj) {
    let {teamId, accounts, done} = obj

    request_post('removeTeamMembers', {
        teamId, accounts
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })

}

// 添加群管理员
export function addTeamManagers({state, commit}, obj) {

    let {teamId, accounts, done} = obj

    request_post('addTeamManagers', {
        teamId, accounts
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}

// 移除群管理员
export function removeTeamManagers({state, commit}, obj) {
    let {teamId, accounts, done} = obj

    request_post('removeTeamManagers', {
        teamId, accounts
    }).then(() => {
        done instanceof Function && done()
    }).catch(err => {
    })
}


// 获取群成员
export function getTeamMembers({state}, teamId) {

    // if (!state.sim) {
    //     // 防止未初始化
    //     setTimeout(() => getTeamMembers(store, teamId), 100);
    //     return
    // }


    request_post('getTeamMemberList', {
        teamId
    }).then(resp => {
        // todo
        onTeamMembers(resp.data)
    })

}
