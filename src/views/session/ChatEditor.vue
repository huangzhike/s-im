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
    import Recorder from '../../plugins/recorder.js'

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
            const data = {
                isEmojiShown: false,
                isRobotListShown: false,
                msgToSent: '',
                icon1: `${config.resourceUrl}/im/chat-editor-1.png`,
                icon2: `${config.resourceUrl}/im/chat-editor-2.png`,
                icon3: `${config.resourceUrl}/im/chat-editor-3.png`,
                icon4: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-keyboard.png`,
                icon5: `https://yx-web-nosdn.netease.im/quickhtml%2Fassets%2Fyunxin%2Fdefault%2Fchat-editor-record.png`,
                sendTxt: true,
                recording: false,
                recordDisable: false,
                toRecordCount: 0,
                recordTime: 0,
                $recordTime: null,
                recordTimeout: '',
                recorder: null,
                audioContext: null
            }

            try {
                data.audioContext = new window.AudioContext
            } catch (e) {
                data.recordDisable = true
                console.error(e)
            }
            return data
        },
        computed: {
            supportTouch() {
                return ("ontouchend" in document && "ontouchstart" in document && "ontouchmove" in document ? true : false)
            }
        },
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
            swicthMsgType() {
                this.sendTxt = !this.sendTxt
            },
            toRecord() {
                var self = this
                self.toRecordCount++
                if (window.stopPlayAudio) {
                    window.stopPlayAudio()
                }
                if (location.protocol === 'http:') {
                    self.$toast('请使用https协议')
                    return
                }
                if (self.recording) {
                    return
                }
                if (self.toRecordCount > 1 && !self.recorder) {
                    self.recordDisable = true
                }
                if (self.recordDisable || !self.audioContext || !window.AudioContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    self.$toast('当前浏览器不支持录音')
                    return
                }
                if (self.recorder) {
                    self.recorder.record()
                    self.resumeAudioContext()
                } else {
                    function failed() {
                        self.recordDisable = true
                        self.$toast('当前浏览器不支持录音')
                    }

                    try {
                        var value = navigator.mediaDevices.getUserMedia({
                            audio: true
                        }).then(stream => {
                            var input
                            try {
                                input = self.audioContext.createMediaStreamSource(stream)
                                self.recorder = new Recorder(input)
                                self.recorder.record()
                                self.resumeAudioContext()
                                if (!self.recorder) {
                                    failed()
                                }
                            } catch (e) {
                                failed()
                            }
                        }).catch(err => {
                            self.$toast('没有权限获取麦克风')
                            self.recordDisable = true
                            console.log('No live audio input: ' + err, err.name + ": " + err.message)
                        })
                    } catch (e) {
                        failed()
                    }
                }
            },
            runRecorderTime() {
                if (this.recorder) {
                    this.recording = true
                    this.recordTime = 0
                    setTimeout(() => {
                        this.$recordTime = document.getElementById('recordTime')
                    }, 800)
                    this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000)
                }
            },
            resumeAudioContext() {
                if (this.audioContext && ~this.audioContext.state.indexOf('suspend')) {
                    this.audioContext.resume().then(() => {
                        console.log('audioContext suspend state resume')
                        this.recorder.record()
                        this.runRecorderTime()
                    })
                } else {
                    this.runRecorderTime()
                }
            },
            runRecordDuration() {
                this.recordTimeout = setTimeout(this.runRecordDuration.bind(this), 1000)
                this.recordTime++
                if (this.recordTime >= 60) {
                    clearTimeout(this.recordTimeout)
                    this.sendRecord()
                }
                this.$recordTime.innerText = '00:' + (this.recordTime > 9 ? this.recordTime : '0' + this.recordTime)
            },
            siwtchRecord() {
                if (this.recording) {
                    this.sendRecordMsg()
                } else {
                    this.toRecord()
                }
            },
            cancelRecord() {
                if (this.recording) {
                    this.recording = false
                    clearTimeout(this.recordTimeout)
                    if (this.$recordTime) {
                        this.$recordTime.innerText = '00:00'
                    }
                    this.recorder.stop()
                    this.recorder.clear()
                }
            },
            sendRecordMsg() {
                setTimeout(this.sendRecord, 500)
            },
            sendRecord() {
                if (this.recording) {
                    clearTimeout(this.recordTimeout)
                    if (this.recordTime < 2) {
                        this.$toast('语音消息最短2s')
                        this.cancelRecord()
                        return
                    }
                    this.recording = false
                    this.$recordTime.innerText = '00:00'
                    this.recorder.stop()
                    this.recorder.exportWAV(blob => {
                        this.$store.dispatch('showLoading')
                        this.$store.dispatch('sendFileMsg', {
                            scene: this.scene,
                            to: this.to,
                            type: 'audio',
                            blob: blob,
                            uploadprogress: obj => {
                                console.log('文件总大小: ' + obj.total + 'bytes')
                                console.log('已经上传的大小: ' + obj.loaded + 'bytes')
                                console.log('上传进度: ' + obj.percentage)
                                console.log('上传进度文本: ' + obj.percentageText)
                                if (obj.percentage === 100) {
                                    this.$store.dispatch('hideLoading')
                                }
                            },
                            uploaderror: () => {
                                console && console.log('上传失败')
                            },
                            uploaddone: (error, file) => {
                                console.log(error)
                            }
                        })
                    })
                    this.recorder.clear()
                }
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

    }


</style>
