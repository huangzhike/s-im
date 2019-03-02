<template>
    <div class='p-teaminvite'>
        <!--邀请朋友加群-->
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">邀请成员</h1>

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
                    <img class="icon u-circle" slot="icon"
                         :src="userInfoMap[friend.account].avatar">
                </span>
            </li>
        </ul>
        <!-- 已选择的朋友 -->
        <div class='m-selected'>
            <!-- 选择的朋友列表 -->
            <div class='avators' ref='avators'>
                <img class='u-circle' v-for='friend in selected' :key='friend.account'
                     :src='userInfoMap[friend.account].avatar' @click='unSelect(friend)'>
                <img src="">
            </div>
            <!-- 确认 -->
            <button class='btn' @click.native='onNext'> {{`确认(${selected.length})`}}</button>
        </div>
        <input v-model="showActionSheet" @on-click-menu="onActionClick"/>
    </div>
</template>

<script>
    import {getPinyin} from '../../../utils/pinyin'

    export default {
        data() {
            return {
                selected: [],
                showActionSheet: false,

            }
        },
        computed: {
            friendList() {
                let teamMember = this.$store.state.teamMemberMap && this.$store.state.teamMemberMap[this.teamId]
                // 处理一下
                let list = this.$store.state.friendList.map(item => {
                    let friend = Object.assign({}, item)
                    let account = friend.account
                    let thisAttrs = this.userInfoMap[account]
                    // 别名
                    let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
                    friend.alias = alias || thisAttrs.nick || account
                    // 生成拼音
                    friend.pinyin = getPinyin(friend.alias, '').toUpperCase()
                    friend.checked = false


                    teamMember && teamMember.forEach(item => {
                        // 好友在群里面
                        if (friend.account === item.account) {
                            friend.ingroup = true
                        }
                    })

                    return friend
                })
                list.sort((a, b) => a.pinyin < b.pinyin ? -1 : a.pinyin > b.pinyin ? 1 : 0)
                return list
            },
            friendsGroups() {
                let map = Object.create(null)
                this.friendList.forEach(friend => {
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
            userInfoMap() {
                return this.$store.state.userInfoMap
            },
            teamId() {
                return this.$route.params.teamId
            },
        },
        methods: {
            // 点击朋友丢进去
            itemClick(friend) {
                if (friend.ingroup) {
                    return
                }

                friend.checked = !friend.checked
                if (friend.checked) {
                    // 丢进去
                    this.selected.push(friend)
                } else {
                    // 删掉
                    this.selected.splice(this.selected.indexOf(friend), 1)
                }
                this.$forceUpdate()
                this.$nextTick(() => this.$refs.avators.scrollLeft = this.$refs.avators.scrollWidth)

            },
            unSelect(friend) {
                friend.checked = false
                this.selected.splice(this.selected.indexOf(friend), 1)
                this.$forceUpdate()
            },
            onNext() {
                if (this.selected.length < 1) {
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
                let accounts = this.selected.map((friend) => friend.account)
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
            onActionClick() {
                let accounts = this.selected.map((friend) => friend.account)

                this.$store.dispatch('showLoading')
                this.$store.dispatch('createTeam', {

                    name: '高级群',
                    accounts: accounts,
                    done: (error, obj) => {
                        if (history.replaceState) {
                            // 改变当前页路由的hash值为联系人页，这样从会话页返回时，不再回到邀请页
                            history.replaceState(null, null, '#/contacts')
                        } else {
                            history.go(-1)
                        }
                        setTimeout(() => {
                            this.$router.push(`#/chat/team-${obj.team.teamId}`)
                            this.$store.dispatch('hideLoading')
                        }, 20);
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
