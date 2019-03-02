<template>


    <div class="">

        <img class="logo" :src="logo">

        <input
                v-model="account"


                placeholder="请输入用户名"

        />

        <input
                v-model="password"
                type="password"

                placeholder="请输入密码"

        />


        <div v-show="errorMsg" class="error">{{errorMsg}}</div>


        <button @click="login">登录</button>


        <button @click="register">注册</button>


    </div>

</template>

<script>


    import md5 from '../../utils/md5'

    import {request_post} from "../../utils/request";


    import config from '../../configs'


    export default {
        data() {
            return {
                logo: config.logo,
                account: {
                    name: "",
                    password: '',
                },
                errorMsg: ''
            }
        },
        mounted() {
            this.$store.dispatch('hideLoading')
            // this.$el.style.display = ""
        },
        methods: {
            login() {

                request_post('getToken', {
                    name: this.account.name,
                    // password: md5(this.account.name + this.account.password)
                    password: this.account.password
                }).then(resp => {
                    console.error("resp", resp)
                    window.sessionStorage.setItem(config.constant.uid, resp.data.id)
                    window.sessionStorage.setItem(config.constant.token, resp.data.token)
                    window.sessionStorage.setItem(config.constant.gateList, resp.data.gateList)
                    this.$router.push("/session")
                })

            },
            register() {
                request_post('register', {
                    name: this.account.name,
                    password: this.account.password
                }).then(resp => {
                    // this.$forceUpdate()
                })
            }
        },
    }


</script>


<style lang="less" type="text/less">


</style>
