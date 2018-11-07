<template>
    <div class="m-chat-editor">
        <!--表情选择-->
        <chat-emoji

                :scene="scene"
                :to="to"
                v-show="isEmojiShown"
                @add-emoji="addEmoji"
                @hide-emoji="hideEmoji"
        ></chat-emoji>
        <!-- 输入框 -->
        <span class="u-editor-input">
            <textarea v-model="msgToSent" @focus='onInputFocus'></textarea>
        </span>
        <!--  -->
        <span class="u-editor-icons">
            <!-- 点击选择表情 -->
            <span class="u-editor-icon" @click.stop="showEmoji">
              <i class="u-icon-img"><img :src="icon1"></i>
            </span>
            <!-- 点击选择文件 -->
            <span class="u-editor-icon" @change="sendFileMsg">
              <i class="u-icon-img"><img :src="icon2"></i>
              <input type="file" ref="fileToSent">
            </span>

            <!-- 发送消息 -->
            <span class="u-editor-send" @click="sendTextMsg">发 送</span>
        </span>

    </div>

</template>

<script>
    import ChatEmoji from './ChatEmoji'
    import util from '../../utils/index'
    import config from '../../configs/index'
    import pageUtil from '../../utils/page'

    export default {
        components: {
            ChatEmoji
        },
        updated() {
            window.document.body.addEventListener('click', () => this.isEmojiShown = false)
        },
        props: {

            scene: String,
            to: String,

            invalid: {
                type: Boolean,
                default: false
            },
            invalidHint: {
                type: String,
                default: '您无权限发送消息'
            },

        },
        watch: {},
        data() {
            return {
                isEmojiShown: false,
                msgToSent: '',
                icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
                icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
                icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
            }
        },
        computed: {},
        methods: {
            sendTextMsg() {
                if (this.invalid) {
                    console.error(this.invalidHint)
                    return
                }
                if (/^\s*$/.test(this.msgToSent)) {
                    // 请不要发送空消息
                    return
                }
                this.msgToSent = this.msgToSent.trim()
                this.$store.dispatch('sendMsg', {
                    type: 'text',
                    scene: this.scene,
                    to: this.to,
                    text: this.msgToSent
                })
                this.msgToSent = ''
            },

            sendFileMsg() {

                let ipt = this.$refs.fileToSent
                if (ipt.value) {
                    this.$store.dispatch('sendFileMsg', {
                        scene: this.scene,
                        to: this.to,
                        fileInput: ipt
                    })
                }
            },
            showEmoji() {
                this.isEmojiShown = true
            },
            hideEmoji() {
                this.isEmojiShown = false
            },
            addEmoji(emojiName) {
                this.msgToSent += emojiName
                this.hideEmoji()
            },

            onInputFocus(e) {
                setTimeout(() => {
                    // todo fixme 解决iOS输入框被遮挡问题，但会存在空白缝隙
                    e.target.scrollIntoView()
                    pageUtil.scrollChatListDown()
                }, 200)
            },

        }
    }
</script>

<style scoped lang="less">

    .m-chat-editor {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;

    }


</style>
