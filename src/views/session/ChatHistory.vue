<template>
    <div class="p-chat-history">
        <!--头部-->
        <header class="m-tab" :left-options="leftBtnOptions" @on-click-back="onClickBack">
            <h1 class="m-tab-top">{{sessionName}}</h1>
            <a slot="left"></a>

        </header>
        <div class="m-chat-main">
            <!--对话-->
            <chat-list
                    ref="chatlist"
                    type="session"
                    :canLoadMore="canLoadMore"
                    :msglist="msglist"
                    :userInfoMap="userInfoMap"
                    :myInfo="myInfo"
                    :isHistory='true'
                    @click="loadMore"
            ></chat-list>
        </div>
    </div>
</template>

<script>
    import ChatList from './ChatList'
    import util from '../../utils/index'
    import pageUtil from '../../utils/page'

    export default {
        beforeMount() {
            // 如果是刷新页面，重定向至聊天页面
            if (this.$store.state.isRefresh) {
                this.$router.push(`/chat/${this.sessionId}`)
            }
        },
        mounted() {
            this.$store.dispatch('resetNoMoreHistoryMsgs')
            this.getHistoryMsgs()
        },
        updated() {
            let tempPagePos = document.getElementById('chat-list').scrollHeight
            pageUtil.scrollChatListDown(tempPagePos - this.currPagePos)
            this.currPagePos = tempPagePos
        },
        components: {
            ChatList
        },
        data() {
            return {
                leftBtnOptions: {
                    backText: ' ',
                    preventGoBack: true,
                },
                currPagePos: 0,

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
                    let userInfo = this.userInfoMap[user] || {}
                    return util.getFriendAlias(userInfo)
                } else if (/^team-/.test(sessionId)) {
                    return '历史记录'
                }
            },

            myInfo() {
                return this.$store.state.myInfo
            },
            userInfoMap() {
                return this.$store.state.userInfoMap
            },
            msglist() {
                return this.$store.state.currSessionMsgs
            },

            scene() {
                return util.parseSession(this.sessionId).scene
            },
            to() {
                return util.parseSession(this.sessionId).to
            },
            canLoadMore() {
                return !this.$store.state.noMoreHistoryMsg
            }
        },
        methods: {
            getHistoryMsgs() {

                this.canLoadMore && this.$store.dispatch('getHistoryMsgs', {
                    scene: this.scene,
                    to: this.to
                })

            },
            loadMore() {
                document.getElementById('chat-list').scrollTop <= 5 && this.getHistoryMsgs()
            },
            onClickBack: function () {
                window.history.go(-1)
            }
        }
    }
</script>

<style scoped lang="less">
    .p-chat-history {

    }
</style>
