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
        onUpdateFriend(null, resp.data)


        commit('updateSearchlist', {
            type: 'user',
            list: resp.data
        })
        let updateUsers = resp.data.filter(item => {
            let account = item.account
            if (item.account === state.userUID) {
                return false
            }
            let userInfo = state.userInfos[account] || {}
            if (userInfo.isFriend) {
                return false
            }
            return true
        })
        updateUsers = updateUsers.map(item => {
            return formatUserInfo(item)
        })
        commit('updateUserInfo', updateUsers)
        if (done instanceof Function) {
            done(resp.data)
        }

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

        if (!Array.isArray(resp.data)) {
            resp.data = [resp.data]
        }
        resp.data.forEach(team => {
            if (team.avatar) {
                team.avatar = team.avatar
            }
        })
        commit('updateSearchlist', {
            type: 'team',
            list: resp.data
        })
        if (done instanceof Function) {
            done(resp.data)
        }

    }).catch(err => {
    })


}
