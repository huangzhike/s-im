<template>

    <div class="g-inherit m-album">
        <div id="form-data" class="g-center m-login">
            <div class="cells">
                <img class="logo" :src="logo">
            </div>
            <div class="cells">
                <div class="cell">
                    <span class="icon icon-account"></span>
                    <input type="text" class="ipt ipt-account" maxlength="20" v-model="account"
                           placeholder="请输入帐号"/>
                </div>
                <div class="cell">
                    <span class="icon icon-pwd"></span>
                    <input type="password" class="ipt ipt-account" maxlength="20" v-model="password"
                           placeholder="请输入密码"/>
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

                // 真实场景应在此向服务器发起ajax请求
                let sdktoken = md5(this.account + this.password)
                // 服务端帐号均为小写
                cookie.setCookie('uid', this.account.toLowerCase())
                cookie.setCookie('sdktoken', sdktoken)
                this.$router.push("/session")

            },
            register() {
                this.$router.push("/register")

            }
        },
    }


</script>


<style lang="less">
    /* 登录注册页面 */
    .m-login {
        .cells {
            position: relative;
            margin: 10px auto;
            .cell {
                position: relative;
                width: 100%;
                border-bottom: 1px solid #ddf;
                line-height: 2rem;
            }
            .logo {
                display: block;
                margin: 1rem auto;
                width: 50%;
                height: auto;
            }
            .ipt {
                box-sizing: border-box;
                padding: 0.6rem 0 0.6rem 2.4rem;
                font-size: 0.9rem;
                color: #fff;
                width: 100%;
                border: none;
                background-color: transparent;
                &::placeholder {
                    color: #d9d9d9;
                }
            }
            .icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                background-image: url(http://yx-web.nos.netease.com/webdoc/h5/im/icons.png);
                background-repeat: no-repeat;
                vertical-align: middle;
            }
            .icon-account {
                background-position: 0 -112px;
                position: absolute;
                left: 0.4rem;
                top: 0.6rem;
            }
            .icon-pwd {
                background-position: 0 -133px;
                position: absolute;
                left: 0.4rem;
                top: 0.6rem;
            }
            .btn {
                margin: 0.6rem 0;
                box-sizing: border-box;
                width: 100%;
                line-height: 2.4rem;
                height: 2.4rem;
                border-radius: 0.4rem;
                background: #fff;

                font-size: 1rem;
                border: none;
                cursor: pointer;
            }
            .btn-regist {
                background: transparent;
                color: #fff;
                /*border: 1px solid #d9d9d9;*/
            }
            .error {
                float: right;
                clear: both;

            }
        }

    }
</style>
