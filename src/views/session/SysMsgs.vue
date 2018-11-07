<template>
    <div class="g-inherit m-article">
        <!--头部-->
        <header class="m-tab" :left-options="{backText: ' '}">

            <a slot="right" @click.stop="clearMsgs">清空</a>
        </header>
        <!--主体-->
        <div class="p-sysmsgs">
            <ul class="u-list">
                <template v-for="msg in msgList">

                    <!-- 群申请 -->
                    <li
                            v-if='msg.type ==="applyTeam" || msg.type ==="teamInvite"'
                            class="u-list-item"
                            :key="msg.idServer"
                            :idServer="msg.idServer"
                    >
                        <img class="icon" slot="icon" :src="msg.avatar">
                        <div slot="child" class='g-teamSys'>
                            <div class='m-info'>
                                <span class='u-name'>{{msg.from}}</span>
                                <span class='u-time'>{{msg.showTime}}</span>
                                <p class='u-desc'>{{msg.desc}}</p>
                                <p v-if='msg.ps' class='u-desc'>{{`留言:${msg.ps}`}}</p>
                            </div>
                            <div class='m-options' slot='default' v-if='deleteIdServer !== msg.idServer'>
                                <template v-if='msg.state === "init"'>
                                    <button type="primary" @click.native="handleTeamApply(msg, true)">同意</button>
                                    <button type="warn" @click.native="handleTeamApply(msg, false)">拒绝</button>
                                </template>
                                <div v-else class='u-msg-state'>
                                    {{msg.state==='error'? '已过期' : msg.state==='rejected'?'已拒绝':'已同意'}}
                                </div>
                            </div>
                        </div>
                        <span class="u-tag-del"
                              :class="{active: deleteIdServer === msg.idServer}"
                              @click="deleteMsg(msg.idServer)">
                        </span>
                    </li>

                    <!-- 其它 -->
                    <li
                            v-else
                            class="u-list-item"
                            :title="msg.showText"
                            :value="msg.showTime"
                            :inline-desc="msg.desc"
                            :key="msg.idServer"
                            :idServer="msg.idServer"
                    >
                        <img class="icon" slot="icon" :src="msg.avatar">
                        <span class="u-tag-del"
                              :class="{active: deleteIdServer === msg.idServer}"
                              @click="deleteMsg(msg.idServer)">
                        </span>
                    </li>
                </template>
            </ul>
            <div class='empty-hint' v-if='!msgList || msgList.length===0'>暂无任何消息</div>
        </div>
    </div>
</template>

<script>
    import config from '../../configs/index'

    export default {

        mounted() {
            // 进入该页面，文档被挂载
            this.$store.dispatch('markSysMsgRead')

        },
        updated() {
            this.$store.dispatch('markSysMsgRead')

        },
        data() {
            return {
                sysType: 0, // 系统消息 0, 自定义消息 1,
                defaultAvatar: config.defaultUserIcon,
                deleteIdServer: ''
            }
        },
        computed: {
            userInfos() {
                return this.$store.state.userInfos || {}
            },
            sysMsgs() {
                let sysMsgs = this.$store.state.sysMsgs.filter(msg => {
                    switch (msg.type) {
                        case 'addFriend':
                            msg.showText = `${msg.friend.alias || msg.friend.account} 添加您为好友~`
                            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar
                            return true
                        case 'deleteFriend':
                            msg.showText = `${msg.from} 将您从好友中删除`
                            msg.avatar = this.userInfos[msg.from].avatar
                            return false
                        case 'applyTeam':
                            console.log('applyTeam', msg)
                            msg.showText = msg.from
                            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar || this.defaultAvatar
                            msg.desc = `申请加入群:${this.getTeamName(msg.to)}`
                            return true
                        case 'teamInvite':
                            msg.showText = msg.attach.team.name
                            msg.avatar = this.userInfos[msg.from] && this.userInfos[msg.from].avatar || this.defaultAvatar
                            msg.desc = `邀请你加入群${msg.to}`
                            return true
                        case 'rejectTeamApply':
                            msg.showText = msg.attach.team.name
                            msg.desc = '管理员拒绝你加入本群'
                            msg.avatar = msg.attach.team.avatar || this.defaultAvatar
                            return true
                        case 'rejectTeamInvite':
                            let op = this.userInfos[msg.from]
                            msg.showText = op.nick
                            msg.avatar = op.avatar || this.defaultAvatar
                            msg.desc = `${op.nick}拒绝了群${this.getTeamName(msg.to)}的入群邀请`
                            return true
                    }
                    console.error(msg)
                    return false
                })
                // 最新的排在前

                return sysMsgs.sort((msg1, msg2) => (msg2.time - msg1.time))
            },

            msgList() {
                return this.sysMsgs
            }

        },
        methods: {
            deleteMsg(idServer) {
                this.$store.commit('deleteSysMsgs', {
                    type: this.sysType,
                    idServer: idServer,
                })
            },
            clearMsgs() {
                // 确认要清空消息吗？
                this.$store.dispatch('resetSysMsgs', {
                    type: this.sysType
                })
            },
            getTeamName(teamId) {
                let team = this.$store.state.teamlist.find(team => team.teamId === teamId)
                return team && team.name || ''
            },
            handleTeamApply(msg, pass) {
                let action
                switch (msg.type) {
                    case 'applyTeam':
                        action = pass ? 'passTeamApply' : 'rejectTeamApply'
                        break;
                    case 'teamInvite':
                        action = pass ? 'acceptTeamInvite' : 'rejectTeamInvite'
                        break;
                    default:
                        return
                }
                this.$store.dispatch('delegateFunction', {
                    functionName: action,
                    options: {
                        idServer: msg.idServer,
                        teamId: msg.to,
                        from: msg.from,
                        done: (error, obj) => {
                            console.log('handleDone', obj)
                        }
                    }
                })
            },

            showDelBtn(vNode) {
                if (vNode && vNode.data && vNode.data.attrs) {
                    this.deleteIdServer = vNode.data.attrs.idServer
                    this.stopBubble = true
                    setTimeout(() => this.stopBubble = false, 20)
                }
            },
            hideDelBtn() {
                if (this.deleteIdServer !== null && !this.stopBubble) {
                    // 用于判断是否前置状态是显示删除按钮
                    this.deleteIdServer = null
                    return true
                }
                return false
            }
        }
    }
</script>

<style lang="less">
    .p-sysmsgs {

    }
</style>
