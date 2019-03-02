<template>
    <div class="g-header">
        <span @click="changePage" class="router-link">
            <router-link :to="{ name: 'session' }">最近会话</router-link>
        </span>
        <span @click="changePage" class="router-link">
            <router-link :to="{ name: 'contacts' }">通讯录</router-link>
        </span>
        <span @click="changePage" class="router-link">
            <router-link :to="{ name: 'general' }">设置</router-link>
        </span>
    </div>


</template>

<script>

    export default {
        components: {},
        data() {
            return {}
        },
        computed: {},
        methods: {
            changePage(page) {
                console.log("page", page)
            }
        }
    }
</script>


<style scoped lang="less" type="text/less">

    .g-window {
        /*顶部布局*/
        .g-header {
            /* 移动端用fixed定位会有bug */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 5;

            .router-link {

            }

        }
    }


</style>
