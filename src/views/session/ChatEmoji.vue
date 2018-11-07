<template>
    <div class="m-chat-emoji">
        <div class="emoji-content">
            <div class="cnt">
                <!-- 表情 -->
                <span class="emoji-item"
                      :class="{'pinup-item':item.type==='pinup'}"
                      v-for="item in currEmoji.list"
                      @click.stop="selectEmoji(item)">
                  <img :src="item.img"/>
                </span>
            </div>
        </div>
        <div class="emoji-channel">
            <!-- 表情集合列表 -->
            <span class="emoji-album"
                  :class="{active: item.name==currAlbum}"
                  v-for="item in emoji"
                  @click.stop="selectAlbum(item)">
            <img :src="item.album">
          </span>
            <span
                    class="emoji-album"
                    :class="{active: item.name==currAlbum}"
                    v-for="item in pinup"
                    @click.stop="selectAlbum(item)">
                <img :src="item.album"/>
            </span>
        </div>
    </div>
</template>

<script>
    import emoji from '../../utils/emoji'

    function genEmojiList(type, emojiList) {
        let result = {}
        for (let name in emojiList) {
            let emojiMap = emojiList[name]
            let list = []
            for (let key in emojiMap) {
                list.push({
                    type,
                    name,
                    key,
                    img: emojiMap[key].img
                })
            }
            if (list.length > 0) {
                result[name] = {
                    type,
                    name,
                    list,
                    album: list[0].img
                }
            }
        }
        return result
    }

    export default {
        props: {

            scene: String,
            to: String
        },
        data() {
            return {
                currType: 'emoji',
                currAlbum: 'emoji'
            }
        },
        computed: {
            emoji() {
                return genEmojiList('emoji', emoji.emojiList)
            },
            pinup() {
                return genEmojiList('pinup', emoji.pinupList)
            },
            currEmoji() {
                if (this.currType === 'emoji') {
                    return this.emoji[this.currAlbum]
                } else if (this.currType === 'pinup') {
                    return this.pinup[this.currAlbum]
                }
                return []
            }
        },
        methods: {
            selectAlbum(album) {
                this.currType = album.type
                this.currAlbum = album.name
            },
            selectEmoji(emoji) {
                if (this.currType === 'emoji') {
                    // 由触发父组件事件，增加表情文案
                    this.$emit('add-emoji', emoji.key)
                }
                // 自定义的贴图表情
                else if (this.currType === 'pinup') {
                    this.$store.dispatch('sendMsg', {
                        type: 'custom',
                        scene: this.scene,
                        to: this.to,
                        pushContent: '[贴图表情]',
                        content: {
                            type: 3,
                            data: {
                                catalog: this.currAlbum,
                                chartlet: emoji.key
                            }
                        }
                    })
                    // 直接发送，然后关闭
                    this.$emit('hide-emoji')
                }
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .m-chat-emoji {
        position: absolute;
        top: -12rem;
        height: 12rem;
        left: 0;
        width: 100%;
        border-top: 1px solid #ccc;
        background-color: #fff;

        .emoji-channel {
            position: relative;
            width: 100%;
            height: auto;
            margin: 0 1rem;

            .emoji-album {
                display: inline-block;
                padding: 0.1rem;
                width: 1.8rem;
                height: 1.8rem;
                border-right: 1px solid #f0f0f0;

                img {
                    margin: 0;
                    display: block;
                    width: inherit;
                    height: inherit;
                }

                &
                .active {
                    background-color: #f0f0f0;
                }

            }
        }
        .emoji-content {
            position: relative;
            width: 100%;
            height: 10rem;
            background-color: #f0f0f0;
            overflow-y: auto;

            .cnt {
                position: relative;
                display: block;
                margin: 0.4rem auto;
                text-align: left;
            }

            .emoji-item {
                display: inline-block;
                width: 28px;
                height: 28px;
                padding: 2px;
                vertical-align: middle;

                img {
                    width: inherit;
                    height: inherit;
                }

            }
            .pinup-item {
                width: 44px;
                height: 44px;
            }

        }

        @media screen and (min-width: 300px) and (max-width: 420px) {
            .emoji-content .cnt {
                width: 300px;
            }
        }

        @media screen and (min-width: 420px) and (max-width: 600px) {
            .emoji-content .cnt {
                width: 420px;
            }
        }

        @media screen and (min-width: 600px) and (max-width: 720px) {
            .emoji-content .cnt {
                width: 600px;
            }
        }

        @media screen and (min-width: 720px) and (max-width: 1080px) {
            .emoji-content .cnt {
                width: 720px;
            }
        }

        @media screen and (min-width: 1080px) {
            .emoji-content .cnt {
                width: 1080px;
            }
        }

    }
</style>
