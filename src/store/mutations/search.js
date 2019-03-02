export function updateSearchlist(state, obj) {
    const type = obj.type
    switch (type) {
        case 'user':
            if (obj.list.length !== 0 || state.searchedUserList.length !== 0) {
                state.searchedUserList = obj.list
            } else {
                state.searchedUserList = []
            }
            break
        case 'team':
            if (obj.list.length !== 0 || state.searchedTeamList.length !== 0) {
                state.searchedTeamList = obj.list
            } else {
                state.searchedTeamList = []
            }
            break
    }
}
