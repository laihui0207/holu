/**
 * Created by sunlaihui on 6/28/15.
 */

var translations = {
    "en": {
        HEADLINE : 'Hello there, This is my awesome app!',
        INTRO_TEXT : 'And it has i18n support!',
        BUTTON_TEXT_EN: 'english',
        BUTTON_TEXT_ZH: '中文',
        PROJECT_TEXT: 'Project',
        PullToFresh: 'Pull to Fresh ....',
        LoginFailHeader: 'Login Failed!',
        LoginFailMessage: 'Please check your credentials!',
        APICallFailed: 'API Call Failed, please check Network',
        SaveFailedHeader: 'Failed',
        SaveFailed: 'Save Failed, please try latter',
        NewNote: 'New Note',
        EditNote: 'Edit Note',
        NoteDetail: 'Note Detail',
        NewMessage: 'New Message',
        MessageDetail: 'Message Detail',
        EditMessage: 'Edit Message',
        Edit: 'Edit',
        NewPostBar: 'New Post',
        PostBarDetail: 'Post Detail',
        ChooseViewUser: 'Select View User',
        ChooseReplyUser: 'Select Reply User',
        NoChooseUser: 'No Select User',
        ChooseViewUserGroup: 'Select View User Group',
        ChooseReplyUserGroup: 'Select Reply User Group',
        NoChooseUserGroup: 'No Select User Group',
        Reply: 'Reply',
        ReplyContent: 'Reply content',
        ViewLimit: 'View Limit',
        ReplyLimit: 'Reply Limit',
        ChooseUser: 'Select User',
        ChooseUserGroup: 'Select User Group',
        EmptyContent: 'No Content Find'

    },
    "zh": {
        HEADLINE : '这是我们的节日哦',
        INTRO_TEXT : 'And it has i18n support!',
        BUTTON_TEXT_EN: 'english',
        BUTTON_TEXT_ZH: '中文',
        Project: '项目管理',
        News: '资讯',
        Posts: '贴吧',
        Notes: '日志',
        Documents: '文档',
        Messages: '消息',
        Status: '状态',
        PullToFresh: '下拉刷新 ....',
        NewsType: '新闻类型',
        Login: '登录',
        UserName: '用户名',
        Password: '密码',
        LoginFailHeader: '登录失败！',
        LoginFailMessage: '请检查用户名和密码',
        Setting: '设置',
        Logout: '注销',
        Title: '标题',
        Content: '内容',
        APICallFailed: '网络请求失败，请检查网络连接',
        SaveFailed: '保存失败，请稍候再试',
        SaveFailedHeader: '保存失败',
        All: '全部',
        NewNote: '新建日志',
        EditNote: '编辑日志',
        Submit: '保存',
        Delete: '删除',
        NoteDetail: '日志明细',
        NewMessage: '新建消息',
        MessageDetail: '消息明细',
        EditMessage: '编辑消息',
        Edit: '编辑',
        Send: '发送',
        NewPostBar: '发贴',
        PostBarDetail: '发贴明细',
        ChooseViewUser: '选择可浏览用户',
        ChooseReplyUser: '选择可回复用户',
        NoChooseUser: '没有选择用户',
        ChooseViewUserGroup: '选择可浏览用户组',
        ChooseReplyUserGroup: '选择可回复用户组',
        NoChooseUserGroup: '没有选择用户组',
        Reply: '回复',
        ReplyContent: '回复内容',
        ViewLimit: '浏览限制',
        ReplyLimit: '回复限制',
        ChooseUser: '选择用户',
        ChooseUserGroup: '选择用户组',
        EmptyContent: '没有内容'

    }
}

var trans=angular.module('Holu.translate', ['pascalprecht.translate']);
trans.config(function($translateProvider) {
    for(lang in translations){
        $translateProvider.translations(lang,translations[lang]);
    }
    $translateProvider.preferredLanguage('zh');
})