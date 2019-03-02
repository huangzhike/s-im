<template>
    <div class='p-membercard'>
        <!--点击群成员列表后进入群成员名片，设置-->
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">群名片</h1>
        </header>
        <div class='g-body'>
            <div class='g-avatar'>
                <img class="icon u-circle" slot="icon" :src="member && member.avatar">
                <div>{{member && member.alias}}</div>
            </div>
            <ul class='m-ul'>
                <li title="群昵称" :value="member.nickInTeam||'未设置'"
                    @click.native="()=> hasSetNickPermission? onEditItemClick('修改群昵称', 'text', 'nickInTeam', getUpdateCallBack()) : $toast('无权限')"
                    is-link></li>
                <li title="身份" :value="memberType"
                    @click.native="()=> hasSetMemberTypePermission? onEditItemClick('身份', 'select', 'memberType', getUpdateCallBack()) : $toast('无权限')"
                    is-link></li>
                <switch v-if='hasMuteOrRemovePermission' class="u-switch" title="设置禁言" v-model="mute"
                        @on-change="changeMute"></switch>
            </ul>
            <button v-if='hasMuteOrRemovePermission' class='u-btn' @click.native='remove'>移出本群</button>
        </div>
    </div>
</template>

<script>
    import config from '../../../configs/index'
    import Utils from '../../../utils/index'

    export default {
        data() {
            return {
                avatar: config.defaultUserIcon,
                teamId: '',
                account: '',
                mute: false,
                selfType: 'normal'
            }
        },
        computed: {
            member() {
                let parseReg = /(\d+)-(\w+)/
                let result = parseReg.exec(this.$route.params.member)
                //
                let teamId = result[1]
                this.teamId = teamId
                //
                let account = result[2]
                this.account = account
                //
                let member = {}
                this.$store.state.teamMemberMap[teamId] && this.$store.state.teamMemberMap[teamId].forEach(item => {
                    if (item.account === account) {
                        // 当前成员
                        member = Object.assign(member, item)
                    }
                    if (item.account === this.$store.state.userUID) {
                        // 是自己，设置身份
                        this.selfType = item.type
                    }
                })
                let userInfo = this.$store.state.userInfoMap[member.account]
                if (member.account === this.$store.state.userUID) {
                    // 是自己
                    userInfo = this.$store.state.myInfo
                }
                member.avatar = userInfo ? userInfo.avatar : (member.avatar || this.avatar)
                member.alias = userInfo ? userInfo.nick : (member.account || 'account')
                // 转换为boolean类型
                this.mute = !!member.mute
                return member
            },
            memberType() {
                if (this.member) {
                    switch (this.member.type) {
                        case 'owner':
                            return '群主'
                        case 'manager':
                            return '管理员'
                        case 'normal':
                            return '普通成员'
                    }
                }
                return '普通成员'
            },
            infoInTeam() {
                return {
                    nickInTeam: this.member.nickInTeam,
                    memberType: this.member.type
                }
            },
            hasSetMemberTypePermission() {
                // 群主也不能改变自己身份
                return this.selfType === 'owner' && this.member.type !== 'owner'
            },
            hasMuteOrRemovePermission() {
                if (this.selfType === 'owner') {
                    // 不能移除自己
                    return this.member.type !== 'owner'
                }
                if (this.selfType === 'manager') {
                    // 只能移除普通成员
                    return this.member.type === 'normal'
                }
                return false
            },
            isSelf() {
                // 是自己
                return this.member.account === this.$store.state.userUID
            },
            hasSetNickPermission() {
                // 不是普通群成员或者是自己
                return this.selfType !== 'normal' || this.isSelf
            }
        },
        methods: {
            changeMute() {
                this.$store.dispatch('updateMuteStateInTeam', {
                    teamId: this.teamId,
                    account: this.account,
                    mute: this.mute,
                    done: (error, obj) => {
                        console.error(this.mute ? '已禁言' : '已取消禁言')
                    }
                })
            },
            getUpdateCallBack() {
                let account = this.member.account
                let store = this.$store

                return (teamId, updateKey, newValue) => {
                    store.dispatch('showLoading')
                    let action = null
                    let opts = {}
                    if (updateKey === 'nickInTeam') {
                        action = 'updateNickInTeam'
                        opts.account = account
                        opts.nickInTeam = newValue
                    } else if (updateKey === 'memberType') {
                        action = newValue === 'manager' ? 'addTeamManagers' : 'removeTeamManagers'
                        opts.accounts = [account]
                    }
                    store.dispatch(action, Object.assign({
                        teamId: teamId,
                        done: (error, obj) => {
                            console.error('更改成功')
                            setTimeout(() => history.go(-1), 200);
                            store.dispatch('hideLoading')
                        }
                    }, opts))
                }
            },
            onEditItemClick(title, inputType, updateKey, confirmCallback) {
                let updateSelfNick = this.isSelf && updateKey === 'nickInTeam'
                this.$store.dispatch('enterSettingPage', {
                    title: title,
                    inputType: inputType,
                    updateKey: updateKey,
                    teamId: this.teamId,
                    updateInfoInTeam: updateSelfNick ? true : false,
                    defaultValue: this.infoInTeam[updateKey],
                    confirmCallback: updateSelfNick ? null : confirmCallback,
                    enable: true
                })
            },
            remove() {
                this.$store.dispatch('showLoading')
                this.$store.dispatch('removeTeamMembers', {
                    teamId: this.teamId,
                    accounts: [this.member.account],
                    done: (error, obj) => {
                        console.error(error ? error : '移除成功')
                        history.go(-1)
                        this.$store.dispatch('hideLoading')
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .g-body {

    }

    .g-avatar {
        margin: 2rem auto;
        width: 100%;
        text-align: center;
    }

    .u-btn {
        width: 80%;
        margin: 1rem 10%;
    }
</style>
