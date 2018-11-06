let scrollTimer = null

let page = {

    // 滚动聊天列表到底部
    scrollChatListDown: (pos, initCount) => {
        let dom = document.getElementById('chat-list')
        if (!dom) {
            return
        }

        let maxCount = 5
        initCount = initCount || 1
        if (typeof pos !== 'number') {
            pos = Math.max(dom.scrollHeight - dom.clientHeight, 9999)
        }
        dom.scrollTop = pos
        if ((dom.scrollTop < pos) && (initCount < maxCount)) {
            clearTimeout(scrollTimer)
            scrollTimer = setTimeout(() => {
                initCount++
                page.scrollChatListDown(pos, initCount)
            }, 200)
        }

    },

}

export default page
