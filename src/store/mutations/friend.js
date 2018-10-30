import util from "../../utils";
import config from '../../configs'
import Vue from 'Vue'

// 好友 + -
export function updateFriends(state, friendList) {

    // 合并
    state.friendslist = util.mergeArrayById(state.friendslist, friendList)


    let len = state.friendslist.length
    // 删除
    while (len--) {
        if (!state.friendslist[len].valid) {
            state.friendslist.splice(len, 1)
        }
    }

}
