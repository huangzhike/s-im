import util from "../../utils";

export function updateMyInfo(state, myInfo) {
    state.myInfo = util.mergeObject(state.myInfo, myInfo)
}

export function updateUserInfo(state, users) {
    let userInfos = state.userInfos
    // userInfos {}
    users.forEach(user => {
        let account = user.account
        if (account) {
            userInfos[account] = util.mergeObject(userInfos[account], user)
        }
    })
    state.userInfos = util.mergeObject(state.userInfos, userInfos)
}