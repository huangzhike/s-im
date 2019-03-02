import store from "../index";
import util from "../../utils";

export function updateTeamList(state, teamList) {


    // 合并
    state.teamList = util.mergeArrayById(state.teamList, teamList)


    let len = state.teamList.length
    // 删除
    while (len--) {
        if (!state.teamList[len].valid) {
            state.teamList.splice(len, 1)
        }
    }



}

export function updateTeamInfo(state, team) {
    let index = state.teamList.findIndex(item => item.teamId === team.teamId)
    if (index === -1) return
    for (const key in team) {
        if (key !== 'teamId' && team.hasOwnProperty(key) && team[key]) {
            state.teamList[index][key] = team[key]
        }
    }
}

export function updateTeamSettingConfig(state, obj) {
    state.teamSettingConfig = obj
}
