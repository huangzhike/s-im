/* 内存数据状态 */

export default {


    // 正在加载中
    isLoading: true,
    // 操作是否是刷新页面，刷新初始没有im实例，会导致时序问题
    isRefresh: true,
    // 全屏显示的原图
    isFullscreenImgShow: false,
    fullscreenImgSrc: '',
    // 切页动画 forward，backward
    transitionName: 'forward',

    // IM SDK 实例
    nim: null,


    // 登录账户ID
    userUID: null,
    // 用户名片
    myInfo: {},
    // 好友/黑名单/陌生人名片
    userInfos: {
        // cid1: {attr: ""},
        // cid2: {attr: ""},
        // ...
    },


    // 好友列表
    friendslist: [],

    teamlist: [],

    // 群对象的成员列表
    teamMembers: {
        tid1: {members: []},
    },

    // 群设置传递数据
    teamSettingConfig: {},


    // 消息列表
    msgs: {
        // sessionId1: "",
        // sessionId2: ""
    },
    // 诸如消息撤回等的消息查找
    msgsMap: {
        // idClient1: "",
        // idClient2: "",
    },


    // 会话列表
    sessionlist: [],
    sessionMap: {},


    // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
    currSessionId: null,
    currSessionMsgs: [],
    // 是否有更多历史消息，用于上拉加载更多
    noMoreHistoryMsgs: false,


    // 系统消息
    sysMsgs: [],

    sysMsgUnread: {
        total: 0
    },


    // 临时变量
    // 缓存需要获取的用户信息账号,如searchUser
    searchedUsers: [],
    // 缓存需要获取的群组账号
    searchedTeams: [],

}
