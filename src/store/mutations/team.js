import store from "../index";

export function updateTeamList(state, teams) {
    const nim = state.nim
    store.state.teamlist = nim.mergeTeams(store.state.teamlist, teams)
    store.state.teamlist = nim.cutTeams(store.state.teamlist, teams.invalid)
}

export function updateTeamInfo(state, team) {
    let index = state.teamlist.findIndex(item => item.teamId === team.teamId)
    if (index === -1) return
    for (const key in team) {
        if (key !== 'teamId' && team.hasOwnProperty(key) && team[key]) {
            state.teamlist[index][key] = team[key]
        }
    }
}

export function updateTeamSettingConfig(state, obj) {
    state.teamSettingConfig = obj
}

export function updateTeamMembers(state, obj) {
    const nim = state.nim
    let teamId = obj.teamId
    let members = obj.members
    state.teamMembers = state.teamMembers || {}
    state.teamMembers[teamId] = nim.mergeTeamMembers(state.teamMembers[teamId], members)
    state.teamMembers[teamId] = nim.cutTeamMembers(state.teamMembers[teamId], members.invalid)

    state.teamMembers[teamId].sort((a, b) => {
        // 将群主和管理员排在队列前方
        if (a.type === 'owner' || b.type === 'owner') {
            return a.type === 'owner' ? -1 : 1
        }
        if (a.type === 'manager' || b.type === 'manager') {
            return a.type === 'manager' ? -1 : b.type === 'manager' ? 1 : 0
        }
        return -1
    })
    state.teamMembers = Object.assign({}, state.teamMembers)
}

export function removeTeamMembersByAccounts(state, obj) {
    let teamId = obj.teamId
    let invalidAccounts = obj.accounts
    if (state.teamMembers[teamId] === undefined) return
    state.teamMembers[teamId] = state.teamMembers[teamId].filter((member, index) => {
        return invalidAccounts.indexOf(member.account) === -1
    })
    state.teamMembers = Object.assign({}, state.teamMembers)
}