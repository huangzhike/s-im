import store from '../'
import {formatUserInfo} from './userInfo'

import {request_post} from "../../common/request";


let friend = {
    // 账号
    account: "",
    // 昵称
    alias: "",
    // 扩展字段, JSON格式字符串
    custom: "",
    // 成为好友的时间
    createTime: "",
    // 更新时间
    updateTime: "",
}


// 好友关系，回调
export function onFriends(obj) {


    switch (obj.type) {
        case 'addFriend':
            console.error('你直接加了一个好友' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.friend);
            break;
        case 'applyFriend':
            console.error('你申请加了一个好友' + obj.account + ', 附言' + obj.ps);
            break;
        case 'passFriendApply':
            console.error('你通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.friend);
            break;
        case 'rejectFriendApply':
            console.error('你拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
            break;
        case 'deleteFriend':
            console.error('你删了一个好友' + obj.account);
            onDeleteFriend(null, {
                account: obj.account
            });
            break;
        case 'updateFriend':
            console.error('你更新了一个好友', obj);
            onUpdateFriend(null, obj.data);
            break;
    }


}

// 更新好友资料，添加好友成功
export function onUpdateFriend(error, friendList) {
    if (error) {
        console.error(error)
        return
    }
    if (!Array.isArray(friendList)) {
        friendList = [friendList]
    }

    friendList = friendList.map(item => {
        if (typeof item.isFriend !== 'boolean') {
            item.isFriend = true
        }
        return item
    })

    // 补充好友资料
    store.dispatch('searchUsers', {
        accounts: friendList.map(item => item.account),
        done: (users) => {
            const sim = store.state.sim
            friendList = sim.mergeFriends(friendList, users).map(formatUserInfo)
            // 更新好友列表
            store.commit('updateFriends', friendList)
            // 更新好友资料
            store.commit('updateUserInfo', friendList)
        }
    })
}

// 删除好友，这里使用标记删除
export function onDeleteFriend(error, friendList) {
    if (error) {
        console.error(error)
        return
    }
    if (!Array.isArray(friendList)) {
        friendList = [friendList]
    }
    friendList = friendList.map(item => {
        item.isFriend = false
        return item
    })
    // 更新好友列表
    store.commit('updateFriends', [], friendList)
    // 更新好友资料
    store.commit('updateUserInfo', friendList)
}


/*
* 暴露给用户调用的
* */


// 更新好友昵称
export function updateFriend({state, commit}, friend) {

    request_post("updateFriend", {
        account: friend.account,
        alias: friend.alias,

    }).then(resp => {
        // todo
        onUpdateFriend(null, resp.data)
    }).catch(err => {
    })


}

export function addFriend({state, commit}, account) {


    request_post("addFriend", {
        // 帐号
        account,
        // 附言
        ps: '',

    }).then(resp => {
        // todo
        onUpdateFriend(null, resp.data)
    }).catch(err => {
    })

}

export function deleteFriend({state, commit}, account) {

    request_post("deleteFriend", {
        // 帐号
        account,


    }).then(resp => {
        // todo
        onDeleteFriend(null, resp.data)
    }).catch(err => {
    })
}


