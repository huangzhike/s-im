import store from '../'
import {formatUserInfo} from './userInfo'
import {handleSysMsgs} from './sysMsgs'
import {request_post} from "../../utils/request";
import util from "../../utils";


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

    let msg = {}

    /*
    * emmmm,我想了想，还是统一用WebSocket推送吧，把POST回调去掉，所以下面的POST改为case api 那里统一处理了
    * */
    switch (obj.type) {

        // 通过 API POST 申请好友但是不需要验证，成功响应回调（加了好友）
        // 通过 WebSocket Push 过来的新增好友回调（被加了好友）
        case 'addFriend':
            console.error('直接加好友' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.list);
            break;
        // 通过API POST 申请好友但是需要验证，成功响应回调
        case 'applyFriend':
            console.error('申请加好友' + obj);
            break;
        // API POST 通过 WebSocket Push 过来的好友申请，成功响应回调
        case 'passFriendApply':
            console.error('通过好友申请' + obj.account + ', 附言' + obj.ps);
            onUpdateFriend(null, obj.list);
            break;
        // API POST 拒绝 WebSocket Push 过来的好友申请，成功响应回调
        case 'rejectFriendApply':
            console.error('拒绝好友申请' + obj.account + ', 附言' + obj.ps);
            break;
        // 通过 API POST 删除好友，成功响应回调（删了好友）
        // 通过 WebSocket Push 过来的删除好友回调（被删了好友）
        case 'deleteFriend':
            console.error('删好友' + obj.account);
            onDeleteFriend(null, [{account: obj.account}]);
            break;
        // 初始化时通过 API POST 拉取好友列表
        // 通过 API POST 更新好友资料如昵称的回调
        case 'updateFriend':
            console.error('更新好友', obj);
            onUpdateFriend(null, obj.list);
            break;

        case 'api':

            break;
        default:
            break;

    }

    handleSysMsgs(msg)


}

/*
* 嗯，其实不想写注释的
* */

// 更新好友资料，添加好友成功
function onUpdateFriend(error, friendList) {

    if (!Array.isArray(friendList)) {
        friendList = [friendList]
    }

    friendList = friendList.map(item => {
        if (typeof item.valid !== 'boolean') {
            item.valid = true
        }
        return item
    })


    // 补充好友资料
    store.dispatch('searchUsers', {
        accounts: friendList.map(item => item.account),
        done: (userList) => {
            // 合并
            friendList = util.mergeArrayById(friendList, userList).map(formatUserInfo)
            // 更新好友列表
            store.commit('updateFriends', friendList)
            // 更新好友资料
            store.commit('updateUserInfo', friendList)
        }
    })
}

// 删除好友
function onDeleteFriend(error, friendList) {

    if (!Array.isArray(friendList)) {
        friendList = [friendList]
    }
    friendList = friendList.map(item => {
        // 标记删除
        item.valid = false
        return item
    })
    // 更新好友列表
    store.commit('updateFriends', friendList)
    // 更新好友资料
    store.commit('updateUserInfo', friendList)
}


/*
* 暴露给前端调用的
* */


// 更新好友昵称
export function updateFriend({state, commit}, friend) {

    request_post("updateFriend", {
        account: friend.account,
        alias: friend.alias,

    }).then(resp => {

        onFriends(resp.data)

    })


}

// 添加好友
export function addFriend({state, commit}, account) {


    request_post("addFriend", {
        // 帐号
        account,
        // 附言
        ps: '',

    }).then(resp => {
            onFriends(resp.data)
        }
    )

}

// 添加好友申请
export function applyFriend({state, commit}, account) {

    request_post("applyFriend", {
        // 帐号
        account,
        // 附言
        ps: '',

    }).then(resp => {
            onFriends(resp.data)
        }
    )

}


// 删除好友申请
export function deleteFriend({state, commit}, account) {

    request_post("deleteFriend", {
        account,
    }).then(resp => {
        // todo
        onFriends(resp.data)

    }).catch(err => {
    })
}


// 拒绝好友申请
export function rejectFriendApply({state, commit}, account) {

    request_post("rejectFriendApply", {
        account,
    }).then(resp => {
        onFriends(resp.data)

    }).catch(err => {
    })
}


// 通过好友申请
export function passFriendApply({state, commit}, account) {

    request_post("passFriendApply", {
        account,
    }).then(resp => {
        // todo
        onFriends(resp.data)

    }).catch(err => {
    })
}
