import util from "../../utils";

export function updateMyInfo(state, myInfo) {
    state.myInfo = util.mergeObject(state.myInfo, myInfo)
}

export function updateUserInfo(state, users) {
    let userInfoMap = state.userInfoMap
    // userInfoMap {}
    users.forEach(user => {
        let account = user.account
        if (account) {
            userInfoMap[account] = util.mergeObject(userInfoMap[account], user)
        }
    })
    state.userInfoMap = util.mergeObject(state.userInfoMap, userInfoMap)
}
