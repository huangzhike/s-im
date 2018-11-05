<template>
    <div class="m-chat-editor">
        <!--输入表情-->
        <chat-emoji
                :type="type"
                :scene="scene"
                :to="to"
                v-show="isEmojiShown"
                @add-emoji="addEmoji"
                @hide-emoji="hideEmoji"
        ></chat-emoji>

        <span class="u-editor-input">
        <textarea v-model="msgToSent" @focus='onInputFocus'></textarea>
      </span>
        <span class="u-editor-icons">
        <span class="u-editor-icon" @click.stop="showEmoji">
          <i class="u-icon-img"><img :src="icon1"></i>
        </span>
        <span class="u-editor-icon" @change="sendFileMsg">
          <i class="u-icon-img"><img :src="icon2"></i>
          <input type="file" ref="fileToSent">
        </span>
        <span v-if="  !advancedTeam" class="u-editor-icon" @click.stop="sendPlayMsg">
          <i class="u-icon-img"><img :src="icon3"></i>
        </span>
        <span v-if='advancedTeam' class="u-editor-send u-editor-receipt" @click="turnToMsgReceipt">回执</span>
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
            window.document.body.addEventListener('click', () => {
                this.isEmojiShown = false
            })
        },
        props: {
            type: String,
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
            advancedTeam: {
                type: Boolean,
                default: false
            }
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
                    alert(this.invalidHint)
                    return
                }
                if (/^\s*$/.test(this.msgToSent)) {
                    // 请不要发送空消息

                    return
                } else if (this.msgToSent.length > 800) {

                    // 请不要超过800个字
                    return
                }
                this.msgToSent = this.msgToSent.trim()
                if (this.type === 'session') {


                    this.$store.dispatch('sendMsg', {
                        type: 'text',
                        scene: this.scene,
                        to: this.to,
                        text: this.msgToSent
                    })
                }
                this.msgToSent = ''
            },
            sendPlayMsg() {
                if (this.invalid) {
                    alert(this.invalidHint)
                    return
                }
                // 发送猜拳消息
                if (this.type === 'session') {
                    this.$store.dispatch('sendMsg', {
                        type: 'custom',
                        scene: this.scene,
                        to: this.to,
                        pushContent: '[猜拳]',
                        content: {
                            type: 1,
                            data: {
                                value: Math.ceil(Math.random() * 3)
                            }
                        }
                    })
                }
            },
            sendFileMsg() {
                if (this.invalid) {
                    alert(this.invalidHint)
                    return
                }
                let ipt = this.$refs.fileToSent
                if (ipt.value) {
                    if (this.type === 'session') {
                        this.$store.dispatch('sendFileMsg', {
                            scene: this.scene,
                            to: this.to,
                            fileInput: ipt
                        })
                    } else if (this.type === 'chatroom') {
                        this.$store.dispatch('sendChatroomFileMsg', {
                            fileInput: ipt
                        })
                    }
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
            turnToMsgReceipt() {
                if (this.invalid) {
                    alert(this.invalidHint)
                    return
                }
                location = `#/teamSendMsgReceipt/${this.to}`
            }
        }
    }
</script>

<style scoped lang="less">

    .m-chat-editor {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: @height_editor;
        background-color: @color_chat_editor_background;
    }

    /* 聊天按钮组件 */
    .m-chat-editor-main {
        position: relative;
        display: block;
        box-sizing: border-box;
        padding: 0;
        height: 100%;
        width: 100%;
        .u-editor-input {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            margin: 0;
            padding: 0.2rem;
            padding-right: 11rem;
            width: 100%;
            height: @height_editor;
            textarea {
                position: relative;
                display: inline-block;
                box-sizing: border-box;
                padding: 0.2rem;
                font-size: 1rem;
                width: 100%;
                height: 100%;
                text-align: left;
                border: 1px solid #ccc;
                border-radius: 0.4rem;
            }
        }
        .u-editor-icons {
            position: absolute;
            display: inline-block;
            right: 0;
            top: 0;
            width: 11rem;
            height: @height_editor;
            .u-editor-icon {
                position: relative;
                display: inline-block;
                top: calc(@height_editor / 2 - 0.8);
                width: 1.6rem;
                height: 1.6rem;
                margin-left: 0.2rem;
                vertical-align: middle;
                input[type="file"] {
                    position: absolute;
                    display: inline-block;
                    left: 0;
                    top: 0;
                    width: inherit;
                    height: inherit;
                    opacity: 0;
                    font-size: 1rem;
                }
            }
        }
        .u-editor-send {
            position: relative;
            display: inline-block;
            top: calc(@height_editor / 2 - 0.8);
            margin-left: 0.2rem;
            width: 2.6rem;
            height: 1.6rem;
            line-height: 1.6rem;
            padding: 0.1rem 0.2rem;
            border-radius: 0.2rem;
            font-size: 0.9rem;
            color: @color_button_font;
            background-color: @color_chat_editor_button;
            text-align: center;
        }
    }

    .u-editor-send.u-editor-receipt {
        background-color: #fefefe;
        border: #ccc solid 1px;
        color: black;
        padding: 0.1rem;
        margin-left: .1rem;
    }
</style>
