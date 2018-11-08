<template>
    <!--群成员列表组件-->
    <div class="m-members" :class='{"s-bg-white":  !showAllMode}'>
        <!--添加群成员-->
        <a v-if='hasInvitePermission && !showAllMode' class='u-member' :href='"#/teaminvite/" + teamId'>
            <img class='avatar' src="" alt="">
            <span>添加</span>
        </a>
        <!--群成员列表-->
        <a class='u-member' v-for='member in membersInDisplay' :key='member.account' @click='onMemberClick(member)'>
            <!--头像-->
            <img class='avatar u-circle' :src='member.avatar'>
            <!--删除-->
            <span v-if='removeMode && member.type!="owner" && member.account!=$store.state.userUID'
                  class='remove'
                  @click='remove($event, member)'></span>
            <!--成员类型-->
            <span v-if='member.type !== "normal"'
                  :class='member.type === "manager"? "manager":"owner"'></span>
            <span>{{member.alias}}</span>
        </a>

    </div>
</template>

<script>
    export default {
        props: {
            teamId: {
                type: String,
            },

            // 显示全部群成员模式
            showAllMode: {
                type: Boolean,
                default: false
            },

        },
        data() {
            return {
                removeMode: false,
                hasManagePermission: false,
                hasSearched: false
            }
        },
        mounted() {
            // 防止在此页面直接刷新，此时需要获取群成员
            let teamMembers = this.$store.state.teamMembers[this.teamId]
            teamMembers === undefined && this.$store.dispatch('getTeamMembers', this.teamId)

        },
        computed: {
            teamInfo() {
                let teamList = this.$store.state.teamlist
                let team = teamList && teamList.find(team => team.teamId === this.teamId)
                return team ? team : undefined
            },
            members() {
                let members = this.$store.state.teamMembers[this.teamId]
                let userInfos = this.$store.state.userInfos
                let needSearchAccounts = []

                if (!members) {
                    return []
                }
                members = members.map(item => {
                    let member = Object.assign({}, item) // 重新创建一个对象，用于存储展示数据，避免对vuex数据源的修改
                    member.valid = true // 被管理员移除后，标记为false
                    if (member.account === this.$store.state.userUID) {
                        // 是自己
                        member.alias = '我'
                        member.avatar = this.$store.state.myInfo.avatar
                        // this.isOwner = member.type === 'owner'
                        this.hasManagePermission = member.type !== 'normal'
                    } else if (userInfos[member.account] === undefined) {
                        // 没有就要搜索
                        needSearchAccounts.push(member.account)
                        member.avatar = member.avatar || this.avatar
                        member.alias = member.nickInTeam || member.account
                    } else {
                        // 有了
                        member.avatar = userInfos[member.account].avatar
                        member.alias = member.nickInTeam || userInfos[member.account].nick
                    }
                    return member
                })
                if (needSearchAccounts.length > 0 && !this.hasSearched) {
                    this.hasSearched = true
                    while (needSearchAccounts.length > 0) {
                        this.searchUsers(needSearchAccounts.splice(0, 150))
                    }
                }
                return members
            },
            membersInDisplay() {

                return this.showAllMode ? this.members : this.members.slice(0, this.hasInvitePermission ? 3 : 4)

            },
            hasInvitePermission() {
                return this.hasManagePermission || (this.teamInfo && this.teamInfo.inviteMode === "all")
            }
        },
        methods: {
            searchUsers(Accounts) {
                this.$store.dispatch('searchUsers', {
                    accounts: Accounts,
                    done: (users) => this.updateTeamMember(users)
                })
            },
            updateTeamMember(users) {
                users.forEach(user => {
                    let member = this.members.find(member => member.account === user.account)
                    if (member) {
                        member.avatar = user.avatar
                        member.alias = member.nickInTeam || user.nick
                    }
                })
            },

            remove(e, member) {
                this.$store.dispatch('showLoading')
                this.$store.dispatch('removeTeamMembers', {
                    teamId: this.teamId,
                    accounts: [member.account],
                    done: (error, obj) => {
                        console.error('移除成功')
                        this.$store.dispatch('hideLoading')
                    }
                })
                e.cancelBubble = true
                e.preventDefault()
            },
            onMemberClick(member) {
                this.$router.push(`#/teammembercard/${member.id}`)
            }
        }
    }
</script>

<style scoped lang="less">

    .m-members {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        text-align: center;
        width: 100%;

    }

</style>
