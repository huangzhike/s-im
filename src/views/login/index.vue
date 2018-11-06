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
                    <span class="icon icon-pwd"></span>
                    <input type="password" class="ipt ipt-account" v-model="password"/>
                </div>
            </div>
            <div class="cells">
                <div v-show="errorMsg" class="error">{{errorMsg}}</div>
            </div>
            <div class="cells">
                <button class="btn btn-login" @click="login">登录</button>
                <button class="btn btn-regist" @click="register">注册</button>
            </div>
        </div>
    </div>

</template>

<script>


    import md5 from '../../utils/md5'
    import cookie from '../../utils/cookie'

    import {request_post} from "../../utils/request";


    import config from '../../configs'


    export default {
        data() {
            return {
                logo: config.logo,
                account: '',
                password: '',
                errorMsg: ''
            }
        },
        mounted() {
            // this.$el.style.display = ""
        },
        methods: {
            login() {
                if (this.account === '') {
                    this.errorMsg = '帐号不能为空'
                    return
                } else if (this.password === '') {
                    this.errorMsg = '密码不能为空'
                    return
                } else if (this.password.length < 6) {
                    this.errorMsg = '密码至少需要6位'
                    return
                }
                this.errorMsg = ''

                request_post('login', {
                    account: this.account,
                    password: md5(this.account + this.password)
                }).then(resp => {
                    let token = resp.token
                    // 服务端帐号均为小写
                    cookie.setCookie('uid', this.account.toLowerCase())
                    cookie.setCookie('token', token)
                    this.$router.push("/session")
                })


            },
            register() {
                this.$router.push("/register")
            }
        },
    }


</script>


<style lang="less">

    .m-login {

    }
</style>
