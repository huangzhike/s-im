<template>
    <div class='p-members'>
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">群成员</h1>

        </header>
        <!--单独的页面显示全部群成员-->
        <team-member :teamId='teamId' :showAllMode='true'></team-member>
    </div>
</template>

<script>
    import config from '../../../configs/index'
    import TeamMember from './TeamMember.vue'

    export default {
        computed: {
            teamId() {
                return this.$route.params.teamId
            },
        },
        components: {
            TeamMember
        }
    }
</script>

<style scoped lang="less">
    .p-members {
        background-color: #e6ebf0;
    }
</style>
