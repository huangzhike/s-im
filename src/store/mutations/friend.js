import util from "../../utils";


// 好友 + -
export function updateFriends(state, friendList) {

    // 合并
    state.friendList = util.mergeArrayById(state.friendList, friendList)


    let len = state.friendList.length
    // 删除
    while (len--) {
        if (!state.friendList[len].valid) {
            state.friendList.splice(len, 1)
        }
    }

}
