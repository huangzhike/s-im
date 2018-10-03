<template>
    <div class='g-inherit m-article p-msg-receipt'>
        <header class="m-tab" :left-options="{backText: ' '}">
            <h1 class="m-tab-top">发送已读回执消息</h1>
            <a slot="left"></a>
        </header>
        <div class="g-body">
            <ul>
                <textarea v-model='inputMsg' placeholder="输入消息内容"></textarea>
                <button type='primary' @click.native='sendMsg'>发送</button>
            </ul>
            <p class='tip'>
                已读回执能力支持文本、图片、音频、视频、文件、自定义等消息类型。此处仅以文本消息作为演示，开发者可以根据具体业务场景进行功能设计。
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                inputMsg: ''
            }
        },
        computed: {
            to() {
                return this.$route.params.teamId
            }
        },
        methods: {
            sendMsg() {
                if (/^\s*$/.test(this.inputMsg)) {

                    // 请不要发送空消息
                    return
                }
                this.$store.dispatch('sendMsg', {
                    type: 'text',
                    scene: 'team',
                    to: this.to,
                    text: this.inputMsg,
                    needMsgReceipt: true
                })
                history.go(-1)
            }
        }
    }
</script>

<style lang="less">
    .p-msg-receipt {
        background-color: #ebeef3;

        .tip {
            padding: 1rem;
            color: #666;
        }

    }
</style>
