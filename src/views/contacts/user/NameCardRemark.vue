<template>
    <div class="g-inherit m-article">
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">[ 备注名 ]</h1>
            <a slot="left"></a>
        </header>
        <ul class="u-card">
            <input
                    class="u-ipt-default"
                    type="text"
                    :required="false"
                    v-model="alias"
                    :max="16"
                    placeholder="请输入备注名"/>
            <span slot="label">备注：</span>
        </ul>
        <div>
            <button type="primary" action-type="button" @click.native="setAlias">设置备注名</button>
        </div>
    </div>
</template>

<script>
    import util from '../../../utils/index'

    export default {
        data() {
            return {
                alias: ''
            }
        },
        mounted() {
            let info = this.$store.state.userInfos[this.account] || {}
            this.alias = info.alias
        },
        computed: {
            account() {
                return this.$route.params.userId
            }
        },
        methods: {
            setAlias() {
                this.alias = this.alias.replace(/\n/g, ' ').replace(/\r/g, '')

                this.$store.dispatch('updateFriend', {
                    account: this.account,
                    alias: this.alias
                })
                window.history.go(-1)
            }
        }
    }
</script>
