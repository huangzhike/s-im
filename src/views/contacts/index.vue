<template>
    <div class="g-inherit m-main p-contacts">
        <div class="m-cards u-search-box-wrap">
            <span class="u-search-box">
                <router-link to="/searchUser/0">  添加好友\群 </router-link>
             </span>
            <span class="u-search-box">
                 <router-link to="/teaminvite/0">  创建组\群 </router-link>
            </span>
        </div>

        <div id="userList" class="m-list">
            <ul class="u-card" title="群">

                <router-link to="/teamList/advanced"> 高级群</router-link>

            </ul>

            <!--好友列表-->
            <ul class="u-card" title="好友列表">
                <li v-for="friend in friendList"
                    :title="friend.alias"
                    :key="friend.account"
                    is-link
                    :link="friend.link">

                    <img class="icon" slot="icon" width="20" :src="userInfoMap[friend.account].avatar">
                </li>

            </ul>

        </div>
    </div>
</template>

<script>

    export default {
        computed: {
            friendList() {
                return this.$store.state.friendList.filter(item => {
                    let account = item.account
                    let thisAttrs = this.userInfoMap[account]
                    let alias = thisAttrs.alias ? thisAttrs.alias.trim() : ''
                    item.alias = alias || thisAttrs.nick || account
                    item.link = `/namecard/${item.account}`
                    return (thisAttrs.isFriend && !thisAttrs.isBlack)

                })
            },

            userInfoMap() {
                return this.$store.state.userInfoMap
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .p-contacts {

        .add-friend {
            background-color: #fff;
        }

        .m-list {
            padding-top: 8rem;
        }

        .u-search-box-wrap {
            text-align: center;
        }

        .u-search-box {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            min-width: 45%;
            padding: 1em;
            height: 3rem;
            text-align: center;
            border: 1px solid #ccc;
            background-color: #fff;
            font-size: 0.8rem;
            box-shadow: 2px 2px 6px #ccc;

            a {
                display: inline-block;
                box-sizing: border-box;
                height: 100%;
                width: 100%;
            }

        }
        .u-card {

        }
    }
</style>
