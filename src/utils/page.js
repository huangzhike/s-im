import config from '../configs'
import router from '../router'




const pageMap = {
    // 'login': config.loginUrl,
    // 'regist': config.registUrl,
    'login': '/login',
    'regist':   '/register'
}

var scrollTimer = null

var page = {

    // 确定导航tab页，是否show nav
    showNav: path => {
        switch (path) {
            case '/':
                return true
            case '/session':
                return true
            case '/contacts':
                return true
            case '/general':
                return true
            default:
                return false
        }
    },
    // 滚动聊天列表到底部
    scrollChatListDown: (pos, initCount) => {
        let dom = document.getElementById('chat-list')
        if (!dom) {
            return
        }
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
    },
    getChatListHeight: () => {
        return document.getElementById('chat-list').scrollHeight
    },
    getChatListScroll: () => {
        return document.getElementById('chat-list').scrollTop
    },
}

export default page