const enums = {
    RESOLVE_STATUS_NAME: [
        { value: 0, label: '待解决' },
        { value: 1, label: '已解决' },
        { value: 2, label: '不予解决' },
        { value: 3, label: '暂缓解决' },
        { value: 4, label: '重复问题' }
    ],

    MEDIA_NAME: [
        { value: 0, label: '截图' },
        { value: 1, label: '录屏' }
    ],

    TYPE_NAME: [
        { value: 0, label: '问题反馈' },
        { value: 1, label: '点赞' }
    ]
}
module.exports = enums;