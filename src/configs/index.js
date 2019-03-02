let config = {


    // 用户logo地址
    logo: '',
    // 默认用户头像
    defaultUserIcon: '',

    // 默认群头像
    defaulTeamIcon: '',
    // 系统通知图标
    noticeIcon: '',

    // 本地消息显示数量，会影响性能
    localMsgLimitCount: 36,

    constant: {
        uid: "uid",
        token: "token",
        gateList: "gateList",
    }
}

const env = 'online'

let appConfig = {

    online: {

        apiUrl: 'http://127.0.0.1:8888',

        webSocketUrl: 'ws://127.0.0.1:9999',
        resourceUrl: '',
    },
    test: {}
}

config = Object.assign(config, appConfig[env])

export default config


