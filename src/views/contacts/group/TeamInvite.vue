<template>
    <div class='p-teaminvite'>
        <!--邀请朋友加群-->
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">邀请成员</h1>
            <a slot="left"></a>
        </header>
        <!--朋友列表-->
        <ul class="m-list">
            <li v-for="group in friendsGroups" :key="group.letter" class='m-group'>
                <em>{{group.letter}}</em>
                <!--根据字母分组-->
                <span v-for="friend in group.arr" :title="friend.alias" :key="friend.account"
                      @click.native='itemClick(friend)'>
                    <span ref='checkIcon' class='check-icon' slot='icon'
                          :class='friend.ingroup ? "checked-grey": (friend.checked ? "checked-blue": "unchecked")'></span>
                    <img class="icon u-circle" slot="icon" width="25" height="25"
                         :src="userInfos[friend.account].avatar">
                </span>
            </li>
        </ul>
        <!--选择的朋友-->
        <div class='m-selected'>
            <!--选择的朋友列表-->
            <div class='avators' ref='avators'>
                <img class='u-circle' v-for='friend in selected' :key='friend.account' width="30" height="30"
                     :src='userInfos[friend.account].avatar' @click='unSelect(friend)'>
                <img width="30" height="30" src='http://yx-web.nos.netease.com/webdoc/h5/im/team_invite_dot_avatar.png'>
            </div>
            <!--确认-->
            <button class='btn' type="primary" :mini='true' action-type="button" @click.native='onNext'>
                {{`确认(${selected.length})`}}
            </button>
        </div>
        <input v-model="showActionSheet" :menus="menus" @on-click-menu="onActionClick" show-cancel/>
    </div>
</template>

<script>
    import {getPinyin} from '../../../utils/pinyin'

    export default {
        data() {
            return {
                selected: [],
                showActionSheet: false,
                menus: {
                    menu1: '创建讨论组',
                    menu2: '创建高级群'
                }
            }
        },
        computed: {
            frinedList() {
                let teamMember = this.$store.state.teamMembers && this.$store.state.teamMembers[this.teamId]
                let list = this.$store.state.friendslist.map(item => {
                    let friend = Object.assign({}, item)
                    let account = friend.account
                    let thisAttrs = this.userInfos[account]
                    let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
                    friend.alias = alias || thisAttrs.nick || account
                    friend.pinyin = getPinyin(friend.alias, '').toUpperCase()
                    friend.checked = false

                    if (teamMember) {
                        teamMember.forEach(item => {
                            if (friend.account === item.account) {
                                friend.ingroup = true
                            }
                        })
                    }
                    return friend
                })
                list.sort((a, b) => {
                    return a.pinyin < b.pinyin ? -1 : a.pinyin > b.pinyin ? 1 : 0
                })
                return list
            },
            friendsGroups() {
                let map = Object.create(null)
                this.frinedList.forEach(friend => {
                    let firstLetter = friend.pinyin[0]
                      firstLetter = firstLetter >= 'A' && firstLetter <= 'Z' ? firstLetter : '#'
                    if (map[firstLetter] === undefined) {
                        map[firstLetter] = []
                    }
                    map[firstLetter].push(friend)
                })
                let groups = []
                for (const key in map) {
                    groups.push({
                        letter: key,
                        arr: map[key]
                    })
                }
                return groups
            },
            userInfos() {
                return this.$store.state.userInfos
            },
            teamId() {
                return this.$route.params.teamId
            },
        },
        methods: {
            itemClick(friend) {
                if (!friend.ingroup) {
                    friend.checked = !friend.checked
                    if (friend.checked) {
                        this.selected.push(friend)
                    } else {
                        this.selected.splice(this.selected.indexOf(friend), 1)
                    }
                    this.$forceUpdate()
                    this.$nextTick(() => {
                        this.$refs.avators.scrollLeft = this.$refs.avators.scrollWidth
                    })
                }
            },
            unSelect(friend) {
                friend.checked = false
                this.selected.splice(this.selected.indexOf(friend), 1)
                this.$forceUpdate()
            },
            onNext() {
                if (this.selected.length < 1) {
                    console.error('未选择成员')
                    return
                }
                if (this.teamId === "0") {
                    // 创建群模式
                    this.showActionSheet = true
                } else {
                    // 添加新成员
                    this.addMembers()
                }
            },
            addMembers() {
                this.$store.dispatch('showLoading')
                let accounts = this.selected.map((friend) => {
                    return friend.account
                })
                this.$store.dispatch('addTeamMembers', {
                    teamId: this.teamId,
                    accounts: accounts,
                    done: (error, obj) => {
                        this.$store.dispatch('hideLoading')

                        console.error('邀请成员成功')
                        setTimeout(() => window.history.go(-1), 200);
                    }
                })
            },
            // 选择成员后是创建什么类型的群
            onActionClick(key) {
                let type, name, accounts = this.selected.map((friend) => {
                    return friend.account
                })
                switch (key) {
                    case "menu1":
                        type = 'normal'
                        name = '讨论组'
                        break
                    case "menu2":
                        type = 'advanced'
                        name = '高级群'
                        break
                    default:
                        // cancle
                        return
                }
                this.$store.dispatch('showLoading')
                this.$store.dispatch('createTeam', {

                    name: name,
                    avatar: '',
                    accounts: accounts,
                    done: (error, obj) => {

                        error && console.error('创群失败' + error)

                        if (!error) {
                            if (history.replaceState) {
                                // 改变当前页路由的hash值为联系人页，这样从会话页返回时，不再回到邀请页
                                history.replaceState(null, null, '#/contacts')
                            } else {
                                history.go(-1)
                            }
                            setTimeout(() => {
                                location.href = `#/chat/team-${obj.team.teamId}`
                                this.$store.dispatch('hideLoading')
                            }, 20);
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .p-teaminvite {
        display: flex;
        flex-direction: column;
        padding-top: 0;


    }
</style>
