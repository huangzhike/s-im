<template>
    <div class='p-teammanager'>
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">群设置</h1>
            <a slot="left"></a>
        </header>
        <div class='m-body'>
            <!--讨论组-->
            <template v-if="teamInfo && teamInfo.type==='normal'">
                <team-member :teamId='teamId'></team-member>
                <ul class='m-ul'>
                    <li title="讨论组名称" :value="teamName" @click.native="()=>onEditItemClick('修改讨论组名称', 'text', 'name')"
                        is-link></li>
                    <button mini type="warn" @click.native='leaveTeam'>退出讨论组</button>
                </ul>
            </template>
            <!--高级群-->
            <template v-if="teamInfo && teamInfo.type==='advanced'">
                <li is-link @click.native='onTeamAvatarClick'>
                    <div class='m-teaminfo' slot='icon'>
                        <img class='avatar u-circle' :src='teamAvatar'>
                        <div class='u-info'>
                            <p>{{teamInfo.name}}</p>
                            <span>{{`${teamInfo.teamId} 于${formatDate(teamInfo.createTime)}创建`}}</span>
                        </div>
                    </div>
                    <form>
                        <input type='file' accept="image/*" ref='input' style="display: none;" @change='onFileSelected'>
                    </form>
                </li>
                <ul class='m-ul'>
                    <li title="群成员" :value="`共${teamMemberNum}人`" is-link :link='`/teammembers/${teamId}`'></li>
                    <team-member :teamId='teamId' :advanced="true"></team-member>
                </ul>
                <ul class='m-ul'>
                    <li title="群名称" :value="teamName"
                        @click.native="()=>onEditItemClick(hasEditPermission?'修改群名称':'群名称', 'text', 'name')"
                        is-link></li>
                    <li title="群昵称" :value="nickName"
                        @click.native="()=>onEditItemClick('修改群昵称', 'text', 'nickInTeam', true)" is-link></li>
                    <li title="群介绍" :value="teamInfo.intro || '未设置'"
                        @click.native="()=>onEditItemClick(hasEditPermission?'修改群介绍':'群介绍', 'textarea', 'intro')"
                        is-link></li>
                </ul>
                <ul class='m-ul' v-if='hasManagePermission'>
                    <li title="身份验证" :value="getTeamInfo('joinMode')"
                        @click.native="()=>onEditItemClick('身份验证', 'select', 'joinMode')" is-link></li>
                </ul>
                <ul class='m-ul'>
                    <template v-if='hasManagePermission'>
                        <li title="邀请他人权限" :value="getTeamInfo('inviteMode')"
                            @click.native="()=>onEditItemClick('邀请他人权限', 'select', 'inviteMode')" is-link></li>
                        <li title="群资料修改权限" :value="getTeamInfo('updateTeamMode')"
                            @click.native="()=>onEditItemClick('群资料修改权限', 'select', 'updateTeamMode')" is-link></li>
                        <li title="被邀请人身份验证" :value="getTeamInfo('beInviteMode')"
                            @click.native="()=>onEditItemClick('被邀请人身份验证', 'select', 'beInviteMode')" is-link></li>
                    </template>
                    <button mini type="warn" @click.native='()=> isOwner ? dismissTeam() : leaveTeam()'>
                        {{isOwner?'解散群聊':'退出高级群'}}
                    </button>
                </ul>
            </template>
        </div>
    </div>
</template>

<script>
    import config from '../../../configs/index'
    import Utils from '../../../utils/index'
    import TeamMember from './TeamMember.vue'

    export default {
        data() {
            return {
                avatar: config.defaultUserIcon,
                isOwner: false,
                hasSearched: false
            }
        },
        computed: {
            teamId() {
                return this.$route.params.teamId
            },
            teamInfo() {
                let teamList = this.$store.state.teamlist
                let team = teamList && teamList.find(team => {
                    return team.teamId === this.teamId
                })
                if (!team) {
                    return undefined
                }
                return team
            },
            teamMembers() {
                return this.$store.state.teamMembers[this.teamId]
            },
            teamMemberNum() {
                return this.teamMembers && this.teamMembers.length
            },
            teamAvatar() {
                return this.teamInfo.avatar || this.avatar
            },
            teamName() {
                return this.teamInfo && this.teamInfo.name || '未设置'
            },
            nickName() {
                if (!this.teamMembers) return '未设置'
                let selfInfo = this.teamMembers.find(item => {
                    return item.account === this.$store.state.userUID
                })
                return (selfInfo && selfInfo.nickInTeam) || '未设置'
            },
            hasManagePermission() {
                if (!this.teamMembers) return false
                let self = this.teamMembers.find(member => member.account === this.$store.state.userUID)
                this.isOwner = self.type === 'owner'
                return self.type !== 'normal'
            },
            hasEditPermission() {
                return this.teamInfo.type === 'normal' || this.teamInfo.updateTeamMode === 'all' || this.hasManagePermission
            }
        },
        methods: {
            onTeamAvatarClick() {
                if (this.hasEditPermission) {
                    this.$refs.input.click()
                }
            },
            onFileSelected(event) {
                this.$store.dispatch('showLoading')
                let fileInput = event.target
                if (fileInput.files.length === 0) {
                    return
                }
                this.$store.dispatch('previewFile', {
                    fileInput,
                    done: (err, data) => {
                        this.$store.dispatch('hideLoading')
                        if (err) {
                            console.error(err)
                        } else {
                            if (data.w < 300 || data.h < 300) {
                                console.error("图片长宽不能小于300")
                                return
                            }
                            this.updateTeamAvatar(data.url)
                        }
                    }
                })
            },
            updateTeamAvatar(url) {
                this.$store.dispatch('updateTeam', {
                    teamId: this.teamId,
                    avatar: url,
                    done: (err, data) => {
                        console.error(err ? err : '修改群头像成功')
                    }
                })
            },
            dismissTeam() {
                // 确定要解散群
                let that = this

                that.$store.dispatch('showLoading')
                that.$store.dispatch('dismissTeam', {
                    teamId: that.teamId,
                    done: (error, obj) => {
                        that.$store.dispatch('hideLoading')
                        console.error(error ? error : '已解散群')
                        window.history.go(-1)
                    }
                })

            },
            leaveTeam() {
                let that = this

                // 确定要退出群
                that.$store.dispatch('showLoading')
                that.$store.dispatch('leaveTeam', {
                    teamId: that.teamId,
                    done: (error, obj) => {
                        that.$store.dispatch('hideLoading')
                        console.error(error ? error : '已退出群')
                        window.history.go(-2)
                    }
                })
            },
            onEditItemClick(title, inputType, updateKey, updateInfoInTeam) {
                this.$store.dispatch('enterSettingPage', {
                    title: title,
                    inputType: inputType,
                    updateKey: updateKey,
                    teamId: this.teamId,
                    defaultValue: this.teamInfo[updateKey],
                    updateInfoInTeam: updateInfoInTeam,
                    enable: updateInfoInTeam ? true : this.hasEditPermission
                })
            },
            getTeamInfo(key) {
                return Utils.teamConfigMap[key][this.teamInfo[key]]
            },
            formatDate: function (timeMill) {
                let date = new Date(timeMill)
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            }
        },
        components: {
            TeamMember
        }
    }
</script>

<style lang="less">

</style>
