<template>
    <div v-show="isLoading">
        <div class="mask_transparent"></div>
        <div class="toast" style="position: absolute;">
            <i class="loading icon_toast"></i>
            <p class="toast__content">加载中</p>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            }
        }
    }
</script>


<style scoped lang="less" type="text/less">


    .g-window {
        .mask_transparent {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99;
            background-color: #000;
            opacity: 0.3;
        }

    }


</style>
