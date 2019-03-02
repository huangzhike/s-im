<template>
    <div class="g-inherit m-main p-session">
        <ul class="u-list">
            <!-- 系统消息 -->
            <li class="u-list-item" title="消息中心" @click.native="enterSysMsgs">
                <img class="icon" slot="icon" width="24" :src="noticeIcon">
                <span v-show="sysMsgUnread > 0" class="u-unread">{{sysMsgUnread}}</span>
            </li>
            <!-- 会话列表 -->
            <li
                    v-for="(session, index) in sessionList"
                    class="u-list-item"
                    :title="session.name"
                    :inline-desc="session.lastMsgShow"
                    :key="session.id"
                    :sessionId="session.id"
                    @click.native="enterChat(session)">
                <!-- ICON -->
                <img class="icon u-circle" slot="icon" width="24" :src="session.avatar">
                <!-- 最近会话时间 -->
                <span class='u-session-time'>  {{session.updateTimeShow}}  </span>
                <!-- 未读数量 -->
                <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
                <!-- 删除会话按钮 -->
                <span
                        class="u-tag-del"
                        :class="{active: delSessionId===session.id}"
                        @click="deleteSession"
                ></span>
            </li>
        </ul>
    </div>
</template>

<script>
    import util from '../../utils/index'
    import config from '../../configs/index'

    export default {

        data() {
            return {
                delSessionId: null,
                stopBubble: false,
                noticeIcon: config.noticeIcon,
                teamIcon: config.defaulTeamIcon,
            }
        },
        computed: {
            sysMsgUnread() {
                return this.$store.state.sysMsgUnread
            },

            sessionList() {
                return this.$store.state.sessionList.filter(item => {
                    item.name = ''
                    item.avatar = ''
                    // 一对一
                    if (item.scene === 'p2p') {
                        let userInfo = this.$store.state.userInfoMap[item.to]

                        if (userInfo) {
                            item.name = util.getFriendAlias(userInfo)
                            item.avatar = userInfo.avatar
                        }
                    }
                    // 群消息
                    else if (item.scene === 'team') {
                        let teamInfo = this.$store.state.teamList.find(team => team.teamId === item.to)

                        if (teamInfo) {
                            item.name = teamInfo.name
                        } else {
                            item.name = `群${item.to}`
                        }
                        item.avatar = teamInfo.avatar || this.teamIcon
                    }
                    // 最近一条消息
                    let lastMsg = item.lastMsg || {}
                    // 文本消息
                    if (lastMsg.type === 'text') {
                        item.lastMsgShow = lastMsg.text
                    }
                    // 群通知消息
                    else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
                        item.lastMsgShow = util.generateTeamSysmMsg(lastMsg)
                    }
                    // 消息类型
                    else if (util.mapMsgType(lastMsg)) {
                        item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`
                    }
                    // 毛也没有
                    else {
                        item.lastMsgShow = ''
                    }
                    // 最近会话时间
                    if (item.updateTime) {
                        item.updateTimeShow = util.formatDate(item.updateTime, true)
                    }
                    return item
                })

            }
        },
        methods: {
            enterSysMsgs() {
                if (this.hideDelBtn())
                    return
                this.$router.push("/sysmsgs")

            },
            enterChat(session) {
                if (this.hideDelBtn())
                    return
                if (session && session.id)
                    this.$router.push(`/chat/${session.id}`)

            },

            deleteSession() {
                if (this.delSessionId !== null) {
                    this.$store.dispatch('deleteSession', this.delSessionId)
                }
            },
            showDelBtn(vNode) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    this.delSessionId = vNode.data.attrs.sessionId
                    this.stopBubble = true
                    setTimeout(() => this.stopBubble = false, 20)
                }
            },
            hideDelBtn() {
                if (this.delSessionId !== null && !this.stopBubble) {
                    // 用于判断是否前置状态是显示删除按钮
                    this.delSessionId = null
                    return true
                }
                return false
            }
        }
    }
</script>

<style lang="less">
    .p-session {

    }
</style>
