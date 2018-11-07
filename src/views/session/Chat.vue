<template>
    <div class="">
        <!-- 头部，点击返回  -->
        <header class="m-tab" :left-options="leftBtnOptions" @on-click-back="onClickBack">
            <!--会话名称-->
            <h1 class="m-tab-top" @click="enterNameCard">{{sessionName}}</h1>

            <div class="m-tab-right" slot="right">
                <!--历史记录-->
                <span class='icon-history' @click='onHistoryClick'></span>
                <!--群管理-->
                <span v-if="scene==='team'" class='icon-team' @click="onTeamManageClick"></span>
            </div>
        </header>
        <!-- 主体 -->
        <div class="">
            <div class='invalidHint' v-if='scene==="team" && teamInvalid'>
                {{`您已退出该群`}}
            </div>
            <!-- 对话列表 -->
            <chat-list

                    :msglist="msglist"
                    :userInfos="userInfos"
                    :myInfo="myInfo"
                    @msgs-loaded="msgsLoaded"
            ></chat-list>
            <!--输入框-->
            <chat-editor

                    :scene="scene"
                    :to="to"
                    :invalid="teamInvalid || muteInTeam"
                    :invalidHint="sendInvalidHint"

            ></chat-editor>
        </div>
    </div>
</template>

<script>
    import ChatEditor from './ChatEditor'
    import ChatList from './ChatList'
    import util from '../../utils/index'
    import pageUtil from '../../utils/page'


    export default {
        components: {
            ChatEditor,
            ChatList
        },

        data() {
            return {
                leftBtnOptions: {
                    backText: ' ',
                    preventGoBack: true,
                }
            }
        },
        // 进入该页面，文档被挂载
        mounted() {
            this.$store.dispatch('showLoading')
            // 此时设置当前会话
            this.$store.dispatch('setCurrSession', this.sessionId)
            pageUtil.scrollChatListDown()

            setTimeout(() => this.$store.dispatch('hideLoading'), 200)

            // 获取群成员
            if (this.scene === 'team') {
                let teamMembers = this.$store.state.teamMembers[this.to]
                // 数量不够就更新
                if (teamMembers === undefined || teamMembers.length < this.teamInfo.memberNum) {
                    this.$store.dispatch('getTeamMembers', this.to)
                }
            }
        },


        computed: {
            sessionId() {
                return this.$route.params.sessionId
            },
            sessionName() {
                let sessionId = this.sessionId
                let user = null
                if (/^p2p-/.test(sessionId)) {
                    user = sessionId.replace(/^p2p-/, '')
                    // 这里。。。
                    let userInfo = this.userInfos[user] || {}
                    return util.getFriendAlias(userInfo)
                } else if (/^team-/.test(sessionId)) {
                    if (this.teamInfo) {
                        // teamInfo中的人数为初始获取的值，在人员增减后不会及时更新，而teamMembers在人员增减后同步维护的人员信息
                        let members = this.$store.state.teamMembers && this.$store.state.teamMembers[this.teamInfo.teamId]
                        let memberCount = members && members.length
                        return this.teamInfo.name + (memberCount ? `(${memberCount})` : '')
                    } else {
                        return '群'
                    }
                }
            },
            scene() {
                return util.parseSession(this.sessionId).scene
            },
            to() {
                return util.parseSession(this.sessionId).to
            },

            myInfo() {
                return this.$store.state.myInfo
            },
            userInfos() {
                return this.$store.state.userInfos
            },

            msglist() {
                return this.$store.state.currSessionMsgs
            },
            teamInfo() {
                if (this.scene === 'team') {
                    let teamId = this.sessionId.replace('team-', '')
                    return this.$store.state.teamlist.find(team => team.teamId === teamId)
                }

            },
            muteInTeam() {
                if (this.scene !== 'team') return false
                let teamMembers = this.$store.state.teamMembers
                let Members = teamMembers && teamMembers[this.teamInfo.teamId]
                let selfInTeam = Members && Members.find(item => item.account === this.$store.state.userUID)
                return selfInTeam && selfInTeam.mute || false
            },
            teamInvalid() {
                return this.scene === 'team' && !(this.teamInfo && this.teamInfo.validToCurrentUser)
            },
            sendInvalidHint() {
                if (this.scene === 'team' && this.teamInvalid) {
                    return `您已不在该群，不能发送消息`
                } else if (this.muteInTeam) {
                    return '您已被禁言'
                }
                return '无权限发送消息'
            }
        },
        methods: {
            onClickBack() {
                window.history.go(-1)
            },
            msgsLoaded() {
                pageUtil.scrollChatListDown()
            },
            // 进入详情卡片
            enterNameCard() {
                if (/^p2p-/.test(this.sessionId)) {
                    let account = this.sessionId.replace(/^p2p-/, '')
                    if (account === this.$store.state.userUID) {
                        this.$router.push("/general")
                    } else {
                        this.$router.push(`/namecard/${account}`)
                    }


                }
            },
            onTeamManageClick() {
                if (this.teamInfo && this.teamInfo.validToCurrentUser) {
                    this.$router.push(`/teammanage/${this.teamInfo.teamId}`)
                } else {
                    console.error('您已退出该群')
                }
            },
            onHistoryClick() {
                if (this.scene !== 'team' || (this.teamInfo && this.teamInfo.validToCurrentUser)) {
                    this.$router.push(`/chathistory/${this.sessionId}`)
                } else {
                    console.error('您已退出该群')
                }
            }
        },
        updated() {
            pageUtil.scrollChatListDown()
        },
        // 离开该页面，此时重置当前会话
        destroyed() {
            this.$store.dispatch('resetCurrSession')
        },
    }
</script>
<style scoped lang="less">

</style>
