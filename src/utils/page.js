let scrollTimer = null

let page = {

    // 确定导航tab页，是否show nav
    showNav: path => {

        return (path == '/' || path == '/session' || path == '/contacts' || path == '/general')

    },
    // 滚动聊天列表到底部
    scrollChatListDown: (pos, initCount) => {
        let dom = document.getElementById('chat-list')
        if (dom) {
            let maxCount = 5
            initCount = initCount || 1
            if (typeof pos !== 'number') {
                pos = Math.max(dom.scrollHeight - dom.clientHeight, 888888)
            }
            dom.scrollTop = pos
            if ((dom.scrollTop < pos) && (initCount < maxCount)) {
                clearTimeout(scrollTimer)
                scrollTimer = setTimeout(() => {
                    initCount++
                    page.scrollChatListDown(pos, initCount)
                }, 200)
            }
        }

    },
    getChatListHeight: () => document.getElementById('chat-list').scrollHeight
    ,
    getChatListScroll: () => document.getElementById('chat-list').scrollTop
    ,
}

export default page
