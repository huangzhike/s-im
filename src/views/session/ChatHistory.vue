<template>
    <div class="g-inherit m-article p-chat-history">
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
                    :userInfos="userInfos"
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
                location.href = `#/chat/${this.sessionId}`
            }
        },
        mounted() {
            this.$store.dispatch('resetNoMoreHistoryMsgs')
            this.getHistoryMsgs()
        },
        updated() {
            let tempPagePos = pageUtil.getChatListHeight()
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
                // selectedDate: ''
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
                    if (user === this.$store.state.userUID) {
                        return '我的手机'
                    } else {
                        let userInfo = this.userInfos[user] || {}
                        return util.getFriendAlias(userInfo)
                    }
                } else if (/^team-/.test(sessionId)) {
                    return '历史记录'
                }
            },

            myInfo() {
                return this.$store.state.myInfo
            },
            userInfos() {
                return this.$store.state.userInfos
            },
            msglist() {
                let msgs = this.$store.state.currSessionMsgs
                return msgs
            },

            scene() {
                return util.parseSession(this.sessionId).scene
            },
            to() {
                return util.parseSession(this.sessionId).to
            },
            canLoadMore() {
                return !this.$store.state.noMoreHistoryMsgs
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

                pageUtil.getChatListScroll() <= 5 && this.getHistoryMsgs()

            },
            onClickBack: function () {
                // location.href = `#/chat/${this.sessionId}`
                window.history.go(-1)
            }
        }
    }
</script>

<style scoped lang="less">
    .p-chat-history {

        .m-chat-main {
            padding: 0;
        }

    }
</style>
