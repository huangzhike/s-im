<template>
    <div class="g-inherit m-article p-search-user">
        <header class="m-tab" :left-options="{backText: ' '}">
            <ul class="m-tab-top" v-model="searchType">
                <li class="u-tab-top">搜索用户</li>
                <li class="u-tab-top">搜索群</li>
            </ul>
            <a slot="left"></a>
        </header>
        <ul class="u-search">
            <input
                    class="u-ipt-default"
                    type="text"
                    v-model="searchText"
                    :placeholder="searchType===0?'请输入搜索内容':'请输入群号'"
                    ref='searchInput'
            />
            <span slot="label">搜索：</span>
        </ul>
        <div>
            <button @click.native="searchUser">搜索</button>
        </div>

        <!--搜索结果-->
        <ul class="u-card u-list">
            <li v-if='searchType === 0'
                v-for="(user, index) in searchList"
                class="u-list-item"
                :title="user.nick"
                :inline-desc="user.account"
                :key="user.account"
                :userId="index"
                is-link
                :link="user.link">
                <img class="icon" slot="icon" :src="user.avatar">
            </li>
            <li v-else
                v-for="team in searchList"
                class="u-list-item"
                :title="team.name"
                :key="team.teamId"
                is-link
                :link="team.link">
                <img class="icon" slot="icon" :src="team.avatar">
            </li>
        </ul>
        <div class="u-card">
            <h3>{{errMsg}}</h3>
        </div>
    </div>
</template>

<script>
    import config from '../../../configs/index'

    export default {
        mounted() {
            this.$nextTick(() => {
                this.searchType = parseInt(this.$route.params.searchType)
                this.$store.dispatch('resetSearchResult')
            })
            // 立即focus会引起切页时白屏，故增加timeout
            setTimeout(() => this.$refs.searchInput.$refs.input.focus(), 0);
        },
        data() {
            return {
                searchType: 0, // 用户 0 群 1
                searchText: '',
                searchList: [],
                errMsg: '',
                // 首次加载标志，因为mount和watch会有时序问题，首次加载不显示errMsg
                firstEntry: true,
            }
        },
        watch: {
            searchResult(val, oldVal) {
                this.errMsg = val.length === 0 && !this.firstEntry ? '无记录' : ''
                this.searchList = val
            },
            searchType() {
                this.$refs.searchInput.$refs.input.focus()
            }
        },
        computed: {
            searchResult() {
                let result = []
                if (this.searchType === 1) {
                    result = this.$store.state.searchedTeamList.map(item => {
                        item.avatar = item.avatar || config.defaultUserIcon
                        item.link = `/teamcard/${item.teamId}`
                        return item
                    })
                } else if (this.searchType === 0) {
                    result = this.$store.state.searchedUserList.map(item => {
                        item.nick = item.nick || item.account
                        item.link = `/namecard/${item.account}`
                        item.avatar = item.avatar || config.defaultUserIcon
                        return item
                    })
                }
                return result
            }
        },
        methods: {
            searchUser() {
                if (!this.searchText) {
                    console.error('未输入内容')
                    return
                }
                this.firstEntry = false
                if (this.searchType === 1) {
                    if (!/^(\d){4,9}$/.test(this.searchText)) {
                        console.error('输入的群号非法')
                        return
                    }
                    this.$store.dispatch('searchTeam', {
                        teamId: this.searchText
                    })
                } else if (this.searchType === 0) {
                    if (this.searchText === this.$store.state.userUID) {
                        this.searchList = []
                        this.errMsg = '别看了，就是你自己！'
                    } else {
                        this.$store.dispatch('searchUsers', {
                            accounts: [this.searchText]
                        })
                    }
                }
            }
        }
    }
</script>
