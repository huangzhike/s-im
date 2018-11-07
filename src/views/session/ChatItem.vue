<template>
    <li class="u-msg"
        :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session'
    }">

        <!--时间戳-->
        <div v-if="msg.type==='timeTag'">---- {{msg.showText}} ----</div>
        <!--提示-->
        <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
        <!--通知 群-->
        <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification">{{msg.showText}}</div>
        <!--聊天-->
        <div
                v-else-if="msg.flow==='in' || msg.flow==='out'"
                :idClient="msg.idClient"
                :time="msg.time"
                :flow="msg.flow"
                :type="msg.type"
                @click="revokeMsg"
        >
            <!--头像-->
            <a class="msg-head" v-if="msg.avatar" :href="msg.link">
                <img class="icon u-circle" :src="msg.avatar">
            </a>
            <p class="msg-user" v-else-if="msg.type!=='notification'"><em>{{msg.showTime}}</em>{{msg.from}}</p>
            <!--文本信息-->
            <span v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></span>
            <span v-else-if="msg.type==='custom-type1'" class="msg-text" ref="mediaMsg"></span>

            <!--图片信息-->
            <span v-else-if="msg.type==='image'" class="msg-text" ref="mediaMsg"
                  @click.stop="showFullImg(msg.originLink)"></span>
            <!--视频-->
            <span v-else-if="msg.type==='video'" class="msg-text" ref="mediaMsg"></span>
            <!--音频-->
            <span v-else-if="msg.type==='audio'" class="msg-text"
                  @click="playAudio(msg.audioSrc)">{{msg.showText}}</span>
            <!--文件-->
            <span v-else-if="msg.type==='file'" class="msg-text">
                <a :href="msg.fileLink" target="_blank"><i class="u-icon icon-file"></i>{{msg.showText}}</a>
            </span>
            <!--通知信息-->
            <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
            <span v-else class="msg-text" v-html="msg.showText"></span>
            <!--失败-->
            <span v-if="msg.status==='fail'" class="msg-failed"><i class="weui-icon-warn"></i></span>


        </div>
    </li>
</template>

<script>
    import util from '../../utils/index'
    import config from '../../configs/index'
    import emoji from '../../utils/emoji'

    export default {
        props: {
            type: String, // 类型, session
            rawMsg: {
                type: Object,
                default() {
                    return {}
                }
            },
            userInfos: {
                type: Object,
                default() {
                    return {}
                }
            },
            myInfo: {
                type: Object,
                default() {
                    return {}
                }
            },

            isHistory: {
                type: Boolean,
                default() {
                    return false
                }
            }

        },
        data() {
            return {
                msg: '',
                isFullImgShow: false,
                currentAudio: null
            }
        },
        computed: {},
        beforeMount() {
            let item = Object.assign({}, this.rawMsg)
            // 发进来的
            if (item.flow === 'in') {
                // 别人发的
                if (item.from !== this.$store.state.userUID) {
                    item.avatar = (this.userInfos[item.from] && this.userInfos[item.from].avatar) || config.defaultUserIcon
                    item.link = `#/namecard/${item.from}`
                } else {
                    // 自己发给自己
                    item.avatar = this.myInfo.avatar
                }
            }
            // 发出去的
            else if (item.flow === 'out') {
                item.avatar = this.myInfo.avatar
            }

            if (item.type === 'timeTag') {
                // 标记发送的时间
                item.showText = item.text
            } else if (item.type === 'text') {
                // 文本消息
                item.showText = util.escape(item.text)
                if (/\[[^\]]+\]/.test(item.showText)) {
                    let emojiItems = item.showText.match(/\[[^\]]+\]/g)
                    // 替换成emoji表情
                    emojiItems.forEach(text => {
                        let emojiCnt = emoji.emojiList.emoji
                        if (emojiCnt[text]) {
                            item.showText = item.showText.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`)
                        }
                    })
                }
            } else if (item.type === 'custom') {
                let content = JSON.parse(item.content)
                // type 3 为贴图表情
                if (content.type === 3) {
                    let data = content.data
                    let emojiCnt = ''
                    if (emoji.pinupList[data.catalog]) {
                        emojiCnt = emoji.pinupList[data.catalog][data.chartlet]
                        item.type = 'custom-type3'
                        item.imgUrl = `${emojiCnt.img}`
                    }
                }
            } else if (item.type === 'image') {
                // 原始图片全屏显示
                item.originLink = item.file.url
            } else if (item.type === 'video') {
                // ...
            } else if (item.type === 'audio') {
                item.audioSrc = item.file.mp3Url
                item.showText = Math.round(item.file.dur / 1000) + '" 点击播放'
            } else if (item.type === 'file') {
                item.fileLink = item.file.url
                item.showText = item.file.name
            } else if (item.type === 'notification') {
                if (item.scene === 'team') {
                    item.showText = util.generateTeamSysmMsg(item)
                }
            } else if (item.type === 'tip') {
                //对于系统通知，更新下用户信息的状态
                item.showText = item.tip
            } else {
                item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
            }
            this.msg = item
        },
        mounted() {
            let item = this.msg
            // 有时序问题的操作
            this.$nextTick(() => {
                let media = null
                if (item.type === 'image') {
                    // 图片消息缩略图
                    media = new Image()
                    // 服务端裁剪
                    media.src = item.file.url + '?imageView&thumbnail=180x0&quality=85'
                } else if (item.type === 'custom-type3') {
                    // 贴图表情
                    media = new Image()
                    media.className = 'emoji-big'
                    media.src = item.imgUrl
                } else if (item.type === 'video') {
                    if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
                        media = document.createElement('video')
                        media.src = item.file.url
                        media.width = 640
                        media.height = 480
                        media.autoStart = false
                        media.preload = 'metadata'
                        media.controls = 'controls'
                    } else {
                        let aLink = document.createElement('a')
                        aLink.href = item.file.url
                        aLink.target = '_blank'
                        aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
                        this.$refs.mediaMsg.appendChild(aLink)
                    }
                }
                if (media) {

                    this.$refs.mediaMsg && this.$refs.mediaMsg.appendChild(media)
                    media.onload = () => this.$emit('msg-loaded')
                    media.onerror = () => this.$emit('msg-loaded')
                } else {
                    this.$emit('msg-loaded')
                }
            }) // end this.nextTick
        },
        methods: {
            // 撤回
            revokeMsg(vNode) {
                // 在会话聊天页
                if (this.$store.state.currSessionId) {
                    if (vNode && vNode.data && vNode.data.attrs) {
                        let attrs = vNode.data.attrs
                        // 自己发的消息
                        if (attrs.flow === 'out') {
                            // 确定需要撤回消息',
                            this.$store.dispatch('revokeMsg', {
                                idClient: attrs.idClient
                            })
                        }
                    }
                }
            },

            showFullImg(src) {
                this.$store.dispatch('showFullscreenImg', {src})
            },
            playAudio(src) {
                if (this.currentAudio)
                    return
                this.currentAudio = new Audio(src)
                this.currentAudio.play()
                this.currentAudio.onended = () => this.currentAudio = null

            },

        }
    }
</script>

<style scoped lang="less">


</style>
