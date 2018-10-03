<template>
    <div class="g-window" id="app">

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

    import pageUtil from './utils/page'

    const sessionHistory = window.sessionStorage

    export default {
        data() {


            // this.$router.push("/session")
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
                        count += 1
                        let fromCount = parseInt(sessionHistory.getItem(fromPath))
                        let toCount = parseInt(sessionHistory.getItem(toPath))
                        if (toCount < fromCount && fromCount < count && (!pageUtil.showNav(fromPath))) {
                            this.transitionName = 'backward'
                            count = toCount
                        } else {
                            this.transitionName = 'forward'
                        }
                        if (pageUtil.showNav(toPath)) {
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
            this.$store.dispatch('updateRefreshState')


        },
        components: {
            NavBar,
            Loading,
            FullscreenImg
        },
        computed: {
            // 是否显示导航条
            showNav() {
                return pageUtil.showNav(this.$route.path)
            }
        }
    }
</script>


<style scoped lang="less">


    /* 封面背景及主题背景，可以设置图片 */
    @album_background: #0091e4;
    @theme_background: #f9fcff;

    /* 导航及tab相关颜色 */
    @color_nav_background: #fff;
    @color_nav_font: #333;
    @color_nav_active_background: #e5f4ff;
    @color_nav_active_font: #0091e4;

    /* 输入框颜色 */
    @color_chat_editor_background: #e5f4ff;
    @color_chat_editor_button: #0091e4;

    /* 基础按钮颜色 */
    @color_base_font: #333;
    @color_error: #ed0e0e;
    @color_tip_background: #e0e0e0;
    @color_tip_font: #ccc;
    @color_button_font: #fff;
    @color_button_primary: #0091e4;
    @color_button_warn: #f04d64;

    @color_input_dark: #333;
    @color_input_light: #999;

    /* 设置颜色变量 */
    @color_white: #fff;

    /* 顶部导航高度 */
    @height_nav: 3.6rem;
    @height_tab: 3.6rem;
    @height_room_banner: 12rem;
    @height_room_tabs: 3rem;

    @height_editor: 4rem;

    /* 消息变量 */
    @msg_bg_you: #5cacde;
    @msg_tx_you: #fff;
    @msg_bg_me: #e5f4ff;
    @msg_tx_me: #666;
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

    /*
* 布局
*/

    /* 手机全屏占比 */
    html, body, .g-window {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: 1rem;
        color: @color_base_font;
    }

    .g-window {

        /* 水平垂直居中布局 */
        .g-center {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 80%;
            height: auto;
            transform: translate(-50%, -50%);
        }

        /* 继承布局 */
        .g-inherit {
            position: inherit;
            display: inherit;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        /* flex布局-中央布局 */
        .g-flex-c {
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
        }
    }

    /***************************************************/

    .g-window {
        .m-main, .m-album, .m-article {
            position: absolute;
            padding-top: @height_nav;
            display: block;
            box-sizing: border-box;
            top: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /* 控制元素在移动设备上是否使用滚动回弹效果 */
            -webkit-overflow-scrolling: touch;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .m-tab-top {
            .u-tab-top {
                color: @color_nav_font;
                border: 1px solid @color_nav_active_font;
                /* 选中状态 */
                &.vux-button-group-current {
                    color: @color_nav_background;
                    background-color: @color_nav_active_font;
                }
            }
        }
        .m-article {
            top: 0;
        }

        /* 用于左右留白布局 */
        .m-cards {
            position: relative;
            display: block;
            width: 90%;
            height: auto;
            margin: 1rem auto;
            z-index: 1;
        }
        .m-list {
            position: absolute;
            display: block;
            box-sizing: border-box;
            top: 0;
            bottom: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            -webkit-overflow-scrolling: touch;
            overflow-y: scroll;
            overflow-x: hidden;
        }
        /* 二级页面的tab */
        .m-tab {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            padding: 10px 0;
            width: 100%;
            height: @height_tab;
            overflow: hidden;
            z-index: 3;

            .m-tab-top {
                position: relative;
                padding: 0;
                font-size: 1.3rem;

            }
            .m-tab-right {
                position: absolute;
                right: 0;
                top: 0.1rem;
                font-size: 0.8rem;
                text-align: right;
                width: 4rem;
            }
        }

        /* 会话列表 */
        .m-article-main, .m-chat-main {
            position: relative;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        /* 聊天页面 */
        .m-chat-main {
            /* 聊天页面有输入框 */
            padding: 0 0 @height_editor 0;
            /* 聊天历史记录没有输入框 */
            &.m-chat-history {
                padding-bottom: 0;
            }
            .m-chat-list {
                position: relative;
                display: block;
                box-sizing: border-box;
                padding: 1rem 2%;
                width: 100%;
                -webkit-overflow-scrolling: touch;
                overflow-y: scroll;
                overflow-x: hidden;
            }
        }

    }


</style>

