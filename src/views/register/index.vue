<template>

    <div class="">
        <div id="form-data" class="m-login">
            <div class="cells">
                <img class="logo" :src="logo">
            </div>
            <div class="cells">
                <div class="cell">
                    <span class="icon icon-account"></span>
                    <input type="text" class="ipt ipt-account" v-model="account"/>
                </div>
                <div class="cell">
                    <span class="icon icon-account"></span>
                    <input type="text" class="ipt ipt-account" v-model="nickname"/>
                </div>
                <div class="cell">
                    <span class="icon icon-pwd"></span>
                    <input type="password" class="ipt ipt-account" v-model="password"/>
                </div>
            </div>
            <div class="cells">
                <div v-show="errorMsg" class="error">{{errorMsg}}</div>
            </div>
            <div class="cells">
                <button type="button" class="btn btn-login" @click="register">注册</button>
                <button type="button" class="btn btn-regist" @click="login">登录</button>
            </div>
        </div>
    </div>

</template>

<script>

    import md5 from '../../utils/md5'
    import cookie from '../../utils/cookie'

    import config from '../../configs'
    import util from '../../utils'

    import {request_post} from "../../utils/request";


    export default {
        data() {
            return {
                logo: config.logo,
                account: '',
                password: '',
                nickname: '',
                errorMsg: ''
            }
        },

        mounted() {
            this.$el.style.display = ""
        },
        methods: {
            register() {
                if (this.account === '') {
                    this.errorMsg = '帐号不能为空'
                    return
                } else if (this.account.length > 20) {
                    this.errorMsg = '帐号最多限20位'
                    return
                } else if (/[^a-zA-Z0-9]/.test(this.account)) {
                    this.errorMsg = '帐号限字母或数字'
                    return
                } else if (this.nickname.length > 10) {
                    this.errorMsg = '昵称限10位中文、英文或数字'
                    return
                } else if (this.password === '') {
                    this.errorMsg = '密码不能为空'
                    return
                } else if (this.password.length < 6) {
                    this.errorMsg = '密码至少需要6位'
                    return
                }
                this.errorMsg = ''


                let accountLowerCase = this.account.toLowerCase()

                request_post('register', {
                    username: accountLowerCase,
                    password: this.password,
                    nickname: this.nickname
                }).then(resp => {
                    this.$router.push("/login")
                    // this.$forceUpdate()
                }).catch(e => {

                })

            },
            login() {

                this.$router.push("/login")

            }
        },

    }


</script>


<style lang="less">

    .m-login {

    }
</style>
