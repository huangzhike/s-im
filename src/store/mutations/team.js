import store from "../index";
import util from "../../utils";

export function updateTeamList(state, teamList) {


    // 合并
    state.teamlist = util.mergeArrayById(state.teamlist, teamList)


    let len = state.teamlist.length
    // 删除
    while (len--) {
        if (!state.teamlist[len].valid) {
            state.teamlist.splice(len, 1)
        }
    }



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
