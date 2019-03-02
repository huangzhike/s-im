<template>
    <div class="g-inherit m-article p-namecard">
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">{{userInfo.alias}}</h1>
            <a slot="left"></a>
        </header>

        <div class="m-list">
            <ul class="u-card">
                <li :title="userInfo.account"
                    :inline-desc="'昵称: '+userInfo.nick"
                    :value="userInfo.gender=='不显示'?'':userInfo.gender">
                    <img class="icon" slot="icon" :src="userInfo.avatar">
                </li>
            </ul>
            <ul class="u-card">
                <li title="性别">{{userInfo.gender}}</li>
                <li title="签名">{{userInfo.sign}}</li>
            </ul>
            <ul v-show="isFriend" class="u-card">
                <li title="备注名" is-link :link="remarkLink">{{userInfo._alias}}</li>
            </ul>

            <div class="u-bottom">
                <button type="primary" @click.native="enterChat">聊天</button>
                <button v-show="isFriend" type="primary" @click.native="enterHistory">历史记录</button>
                <button v-show="isFriend" type="warn" @click.native="deleteFriend">删除好友</button>
                <button v-show="!isFriend && !isSelf" type="warn" @click.native="addFriend"> 添加好友</button>
            </div>
        </div>
    </div>
</template>

<script>
    import util from '../../../utils/index'

    export default {
        data() {
            return {
                isBlack: false,
                isSelf: false
            }
        },
        computed: {
            account() {
                return this.$route.params.userId
            },
            userInfo() {
                let info = {}
                if (this.account === this.$store.state.userUID) {
                    info = Object.assign({}, this.$store.state.myInfo)
                    info.alias = info.nick
                    this.isSelf = true
                } else {
                    info = Object.assign({}, this.$store.state.userInfoMap[this.account])
                    info._alias = info.alias // 服务器中存的别名，在备注栏展示
                    info.alias = util.getFriendAlias(info)
                    this.isBlack = info.isBlack
                }
                return info
            },

            // 是否是联系人，黑名单和好友都算
            isFriend() {
                return this.userInfo.isFriend
            },

            remarkLink() {
                return `/namecardremark/${this.account}`
            }
        },
        methods: {

            enterChat() {
                this.$router.push(`#/chat/p2p-${this.account}`)
            },
            enterHistory() {
                this.$router.push(`#/chatHistory/p2p-${this.account}`)
            },
            addFriend() {
                this.$store.dispatch('addFriend', this.account)
            },
            deleteFriend() {
                this.$store.dispatch('deleteFriend', that.account)
            }
        }
    }
</script>

<style type="text/css" lang="less">
    .p-namecard {

    }

</style>
