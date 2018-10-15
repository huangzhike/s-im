export function updateSearchlist(state, obj) {
    const type = obj.type
    switch (type) {
        case 'user':
            if (obj.list.length !== 0 || state.searchedUsers.length !== 0) {
                state.searchedUsers = obj.list
            } else {
                state.searchedUsers = []
            }
            break
        case 'team':
            if (obj.list.length !== 0 || state.searchedTeams.length !== 0) {
                state.searchedTeams = obj.list
            } else {
                state.searchedTeams = []
            }
            break
    }
}
