<template>
    <div class='p-teamList'>
        <header class="m-tab" :left-options="{backText: ' '}">

        </header>
        <!--群列表-->
        <div class="m-list">
            <ul>

                <router-link v-for='team in teamList'
                             v-text="team.name"
                             :key='team.teamId'
                             :to='`/chat/team-${team.teamId}`'>

                </router-link>

            </ul>
        </div>
        <div class='empty-hint' v-if='!teamList || teamList.length<1'>暂无内容</div>
    </div>
</template>

<script>
    export default {
        mounted() {

        },
        data() {
            return {}
        },
        computed: {
            teamList: function () {
                return this.$store.state.teamList && this.$store.state.teamList.filter(team => team.validToCurrentUser)
            },

        }
    }
</script>

<style scoped lang="less" type="text/less">
    .p-teamList {

        .m-list {
            padding-top: 3.6rem;
        }

        .empty-hint {
            position: absolute;
            left: 0;
            right: 0;
            top: 5rem;
            margin: auto;
            text-align: center;
        }

    }
</style>

