/*
 * 用户关系及好友关系托管
 */

/*

account: 账号
alias: 昵称
custom: 扩展字段, 开发者可以自行扩展, 建议封装成JSON格式字符串
createTime: 成为好友的时间
updateTime: 更新时间
*/

import store from '../'
import {formatUserInfo} from './userInfo'

// 好友关系，回调
export function onFriends(friends) {
    friends = friends.map(item => {
        if (typeof item.isFriend !== 'boolean') {
            item.isFriend = true
        }
        return item
    })
    store.commit('updateFriends', friends)
    // 更新好友信息字典，诸如昵称
    store.commit('updateUserInfo', friends)
}

// 更新好友资料，添加好友成功
export function onUpdateFriend(error, friends) {
    if (error) {
        console.error(error)
        return
    }
    if (!Array.isArray(friends)) {
        friends = [friends]
    }

    friends = friends.map(item => {
        if (typeof item.isFriend !== 'boolean') {
            item.isFriend = true
        }
        return item
    })

    // 补充好友资料
    store.dispatch('searchUsers', {
        accounts: friends.map(item => {
            return item.account
        }),
        done: (users) => {
            const nim = store.state.nim
            friends = nim.mergeFriends(friends, users).map(formatUserInfo)
            // 更新好友列表
            store.commit('updateFriends', friends)
            // 更新好友资料
            store.commit('updateUserInfo', friends)
        }
    })
}

// 删除好友，这里使用标记删除
export function onDeleteFriend(error, friends) {
    if (error) {
        console.error(error)
        return
    }
    if (!Array.isArray(friends)) {
        friends = [friends]
    }
    friends = friends.map(item => {
        item.isFriend = false
        return item
    })
    // 更新好友列表
    store.commit('updateFriends', [], friends)
    // 更新好友资料
    store.commit('updateUserInfo', friends)
}

/*
        当前登录用户在其它端进行好友相关的操作后的回调 包括
        直接加为好友
        申请加为好友
        通过好友申请
        拒绝好友申请
        删除好友
        更新好友

 */

export function onSyncFriendAction(obj) {
    switch (obj.type) {
        case 'addFriend':
            console.error('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.friend);
            break;
        case 'applyFriend':
            console.error('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
            break;
        case 'passFriendApply':
            console.error('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.friend);
            break;
        case 'rejectFriendApply':
            console.error('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
            break;
        case 'deleteFriend':
            console.error('你在其它端删了一个好友' + obj.account);
            onDeleteFriend(null, {
                account: obj.account
            });
            break;
        case 'updateFriend':
            console.error('你在其它端更新了一个好友', obj.friend);
            onUpdateFriend(null, obj.friend);
            break;
    }
}

// 更新好友昵称
export function updateFriend({state, commit}, friend) {
    const nim = state.nim
    nim.updateFriend({
        account: friend.account,
        alias: friend.alias,
        done: onUpdateFriend
    })
}

export function addFriend({state, commit}, account) {
    const nim = state.nim
    nim.addFriend({
        // 帐号
        account,
        // 附言
        ps: '',
        done: onUpdateFriend
    })
}

export function deleteFriend({state, commit}, account) {
    const nim = state.nim
    nim.deleteFriend({
        account,
        done: onDeleteFriend
    })
}


