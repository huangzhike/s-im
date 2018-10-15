import util from "../../utils";
import config from '../../configs'
import Vue from 'Vue'

// 好友 + -
export function updateFriends(state, friends, cutFriends = []) {
    const nim = state.nim
    state.friendslist = util.mergeArrayById(state.friendslist, friends)

    state.friendslist = nim.cutFriends(state.friendslist, friends.invalid)
}