import util from "../../utils";

export function updateTeamMembers(state, obj) {

    let teamId = obj.teamId
    let members = obj.members
    state.teamMemberMap = state.teamMemberMap || {}

    let teamMemberList = state.teamMemberMap[teamId]


    // 合并
    teamMemberList = util.mergeArrayById(teamMemberList, members)


    let len = teamMemberList.length
    // 删除
    while (len--) {
        if (!teamMemberList[len].valid) {
            teamMemberList.splice(len, 1)
        }
    }

    state.teamMemberMap[teamId].sort((a, b) => {
        // 将群主和管理员排在队列前方
        if (a.type === 'owner' || b.type === 'owner') {
            return a.type === 'owner' ? -1 : 1
        }
        if (a.type === 'manager' || b.type === 'manager') {
            return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0
        }
        return -1
    })
    state.teamMemberMap = Object.assign({}, state.teamMemberMap)
}

export function removeTeamMembersByAccounts(state, obj) {
    let teamId = obj.teamId
    let invalidAccounts = obj.accounts


    if (state.teamMemberMap[teamId] === undefined) return
    state.teamMemberMap[teamId] = state.teamMemberMap[teamId].filter((member, index) => {
        return invalidAccounts.indexOf(member.account) === -1
    })
    state.teamMemberMap = Object.assign({}, state.teamMemberMap)
}
