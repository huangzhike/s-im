import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
    // 设置聊天列表页面为首页
    {
        path: '/',
        redirect: {
            name: 'session'
        }

        ,
        meta: {
            title: ''
        }
    },
    // 最近消息列表（会话）
    {
        path: '/session',
        name: 'session',
        component: () => import('../views/session/index'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register/index'),
    },
    // 系统消息
    {
        path: '/sysmsgs',
        name: 'sysmsgs',
        component: () => import('../views/session/SysMsgs'),
    },
    // 聊天记录
    {
        path: '/chat/:sessionId',
        name: 'chat',
        component: () => import('../views/session/Chat'),
    },
    // 聊天历史记录
    {
        path: '/chathistory/:sessionId',
        name: 'chathistory',
        component: () => import('../views/session/ChatHistory'),
    },

    // 通讯录
    {
        path: '/contacts',
        name: 'contacts',
        component: () => import('../views/contacts/index'),
    },
    // 好友名片
    {
        path: '/namecard/:userId',
        name: 'namecard',
        component: () => import('../views/contacts/user/NameCard'),
    },
    // 好友名片-设置备注
    {
        path: '/namecardremark/:userId',
        name: 'namecardremark',
        component: () => import('../views/contacts/user/NameCardRemark'),
    },
    // 好友名片-搜索好友/群
    {
        path: '/searchuser/:searchType',
        name: 'searchuser',
        component: () => import('../views/contacts/search/index'),
    },
    // 邀请好友-加入群
    {
        path: '/teaminvite/:teamId',
        name: 'teaminvite',
        component: () => import('../views/contacts/group/TeamInvite'),
    },
    // 通用页面
    {
        path: '/general',
        name: 'general',
        component: () => import('../views/general/index'),
    },
    // 群列表
    {
        path: '/teamlist/:teamType',
        name: 'teamlist',
        component: () => import('../views/contacts/group/TeamList'),
    },
    // 群名片
    {
        path: '/teamcard/:teamId',
        name: 'teamcard',
        component: () => import('../views/contacts/group/TeamCard'),
    },
    // 群管理
    {
        path: '/teammanage/:teamId',
        name: 'teammanage',
        component: () => import('../views/contacts/group/TeamManage'),
    },
    // 群设置
    {
        path: '/teamsetting',
        name: 'teamsetting',
        component: () => import('../views/contacts/group/TeamSetting'),
    },
    // 群成员列表
    {
        path: '/teammembers/:teamId',
        name: 'teammembers',
        component: () => import('../views/contacts/group/TeamMembers'),
    },
    // 群成员名片
    {
        path: '/teammembercard/:member',
        name: 'teammembercard',
        component: () => import('../views/contacts/group/TeamMemberCard'),
    },
    // 发送群消息回执页
    {
        path: '/teamSendMsgReceipt/:teamId',
        name: 'TeamSeamMsgReceipt',
        component: () => import('../views/contacts/group/TeamSendMsgReceipt'),
    },
    // 群消息回执详情页
    {
        path: '/msgReceiptDetail/:msgInfo',
        name: 'msgReceiptDetail',
        component: () => import('../views/contacts/group/TeamMsgReceiptDetail'),
    }
]

let router = new VueRouter({

    routes
})


// 路由守卫

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});



//
// /**
//  * 路由拦截
//  * 权限验证
//  */
// router.beforeEach((to, from, next) => {
//     // 进度条
//     NProgress.start()
//     // 关闭搜索面板
//     store.commit('d2admin/search/set', false)
//     // 验证当前路由所有的匹配中是否需要有登录验证的
//     if (to.matched.some(r => r.meta.requiresAuth)) {
//         // 这里暂时将cookie里是否存有token作为验证是否登录的条件
//         // 请根据自身业务需要修改
//         const token = util.cookies.get('token')
//         if (token && token !== 'undefined') {
//             next()
//         } else {
//             // 将当前预计打开的页面完整地址临时存储 登录后继续跳转
//             // 这个 cookie(redirect) 会在登录后自动删除
//             util.cookies.set('redirect', to.fullPath)
//             // 没有登录的时候跳转到登录界面
//             next({
//                 name: 'login'
//             })
//         }
//     } else {
//         // 不需要身份校验 直接通过
//         next()
//     }
// })
//
// router.afterEach(to => {
//     // 进度条
//     NProgress.done()
//     // 需要的信息
//     const app = router.app
//     const { name, params, query } = to
//     // 多页控制 打开新的页面
//     app.$store.dispatch('d2admin/page/open', { name, params, query })
//     // 更改标题
//     util.title(to.meta.title)
// })


export default router
