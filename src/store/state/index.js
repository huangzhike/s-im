/* 内存数据状态 */

export default {


    // 正在加载中
    isLoading: true,

    // 全屏显示的原图
    isFullscreenImgShow: false,
    fullscreenImgSrc: '',
    // 切页动画 forward，backward
    transitionName: 'forward',

    // IM 实例
    sim: null,

    // 登录账户ID
    userUID: null,
    token: null,
    gateList: null,


    // 用户名片
    myInfo: {},
    // 好友/黑名单/陌生人名片
    userInfoMap: {
        // cid1: {attr: ""},
        // cid2: {attr: ""},
        // ...
    },


    // 好友列表
    friendList: [],

    teamList: [],

    // 群对象的成员列表
    teamMemberMap: {
        // tid1:[member,...],
    },

    // 群设置传递数据
    teamSettingConfig: {},


    // 消息列表
    msgs: {
        // sessionId1:  [],
        // sessionId2: []
    },
    // 诸如消息撤回等的消息查找
    msgsMap: {
        // idClient1: "",
        // idClient2: "",
    },


    // 会话列表
    sessionList: [],
    sessionMap: {
        // sessionId1:session
    },


    // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
    currSessionId: null,
    currSessionMsgs: [],

    // 是否有更多历史消息，用于上拉加载更多
    noMoreHistoryMsg: false,

    // 系统消息
    sysMsgs: [],

    sysMsgUnread: {
        total: 0
    },


    // 临时变量
    // 缓存需要获取的用户信息账号,如searchUser
    searchedUserList: [],
    // 缓存需要获取的群组账号
    searchedTeamList: [],

}
