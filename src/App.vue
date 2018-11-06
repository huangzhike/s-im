<template>
    <div id="app" class="">

        <nav-bar v-show="showNav"></nav-bar>
        <!-- 切页动画设置 -->
        <transition :name="transitionName">
            <router-view/>
        </transition>
        <fullscreen-img></fullscreen-img>
        <loading></loading>
    </div>
</template>

<script>

    import Loading from './components/Loading'
    import FullscreenImg from './components/FullscreenImg'
    import NavBar from './components/NavBar'

    const sessionHistory = window.sessionStorage

    export default {
        data() {

            return {
                transitionName: 'forward'
            }
        },
        watch: {
            // 更新页面所在位置，用于判断是前进页还是后退页
            '$route'(to, from) {

                console.error(to)
                if (to && from) {
                    let toPath = to.path
                    let fromPath = from.path
                    let count = parseInt(sessionHistory.getItem('count'))
                    // 如果是导航页或者没有初始记录
                    if (Number.isNaN(count)) {
                        count = 1
                        this.transitionName = 'forward'
                    } else {
                        count++
                        let fromCount = parseInt(sessionHistory.getItem(fromPath))
                        let toCount = parseInt(sessionHistory.getItem(toPath))
                        if (toCount < fromCount && fromCount < count && (!this.nav(fromPath))) {
                            this.transitionName = 'backward'
                            count = toCount
                        } else {
                            this.transitionName = 'forward'
                        }
                        if (this.nav(toPath)) {
                            count = 1
                        }
                    }
                    sessionHistory.setItem(toPath, count)
                    sessionHistory.setItem('count', count)
                }
            }
        },
        // 所有页面更新都会触发此函数
        updated() {
            console.error("update")
            // 异步加载组件都会update
            // 提交sdk连接请求
            this.$store.dispatch('connect')
        },
        components: {
            NavBar,
            Loading,
            FullscreenImg
        },
        computed: {
            // 是否显示导航条
            showNav() {
                let path = this.$route.path
                return this.nav(path)
            }
        },
        methods: {
            nav(path) {
                return (path === '/' || path === '/session' || path === '/contacts' || path === '/general')
            }
        }
    }
</script>


<style scoped lang="less">


    /***************************************************************/

    /* 样式初始化 */
    * {
        margin: 0;
        padding: 0;
    }

    html {
        text-size-adjust: 100%;
    }

    body {
        line-height: 1.5;
        font-size: 16px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    h1, h2, h3, h4, h5, h6 {
        font-weight: normal;
        text-align: center;
    }

    textarea, input {
        outline: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    a {
        display: inline-block;
        line-height: inherit;
        color: inherit;
        outline: 0;
        text-decoration: none;
        cursor: pointer;

        &
        :link,
        &
        :visited,
        &
        :active,
        &
        :hover {
            color: inherit;
        }

        img {
            border: 0;
        }

    }

    li {
        list-style: none;
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #ebeef3;
        -webkit-border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:vertical {
        height: 32px;
        background-color: #d8dce4;
        -webkit-border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        width: 32px;
        background-color: #d8dce4;
        -webkit-border-radius: 4px;
    }

    /************************************************/

    /* 手机全屏占比 */
    html, body {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: 1rem;
    }


</style>

