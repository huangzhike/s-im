import util from "../../utils";
import config from '../../configs'
import Vue from 'Vue'

// 好友 + -
export function updateFriends(state, friends, cutFriends = []) {
    const sim = state.sim
    state.friendslist = util.mergeArrayById(state.friendslist, friends)

    state.friendslist = sim.cutFriends(state.friendslist, friends.invalid)
}
