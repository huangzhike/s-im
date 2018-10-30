import {formatUserInfo} from './userInfo'


import {request_post} from "../../common/request";
import {onUpdateFriend} from "./friends";


export function resetSearchResult({state, commit}) {
    commit('updateSearchlist', {
        type: 'user',
        list: []
    })
    commit('updateSearchlist', {
        type: 'team',
        list: []
    })
}

export function searchUsers({state, commit}, obj) {
    let {accounts, done} = obj

    if (!Array.isArray(accounts)) {
        accounts = [accounts]
    }
    // todo


    request_post("getUsers", {
        accounts
    }).then(resp => {
        // todo


        let data = resp.data.list

        onUpdateFriend(null, data)


        commit('updateSearchlist', {
            type: 'user',
            list: data
        })
        let updateUsers = data.filter(item => {
            let account = item.account
            if (item.account === state.userUID) {
                // 本人
                return false
            }
            let userInfo = state.userInfos[account] || {}
            // 已经是好友
            if (userInfo.valid) {
                return false
            }
            return true
        })
        // 格式化
        updateUsers = updateUsers.map(item => formatUserInfo(item))
        // 更新用户信息
        commit('updateUserInfo', updateUsers)
        // 回调
        done instanceof Function && done(data)

    }).catch(err => {
    })


}

export function searchTeam({state, commit}, obj) {
    let {teamId, done} = obj


    // todo

    request_post("getTeam", {
        teamId

    }).then(resp => {
        // todo

        let data = resp.data.list

        if (!Array.isArray(data)) {
            data = [data]
        }
        data.forEach(team => {
            if (team.avatar) {
                team.avatar = team.avatar
            }
        })
        commit('updateSearchlist', {
            type: 'team',
            list: data
        })
        done instanceof Function && done(data)

    }).catch(err => {
    })


}
