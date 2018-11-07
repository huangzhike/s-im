<template>
    <div class="" v-if="myInfo.account">
        <ul class="u-card">
            <li :title="myInfo.nick" :inline-desc="'帐号: ' + myInfo.account">
                <img class="icon" slot="icon" width="20" :src="myInfo.avatar">
            </li>
        </ul>
        <ul class="u-card">
            <li title="昵称">{{myInfo.nick || ''}}</li>
            <li title="签名">{{myInfo.sign}}</li>
        </ul>
        <div>
            <button @click.native="logout">注销</button>
        </div>
    </div>
</template>

<script>

    export default {
        components: {
        },
        computed: {
            myInfo() {
                return this.$store.state.myInfo
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('logout')
            }
        }
    }
</script>
