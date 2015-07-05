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
        SaveFailed: 'Save Failed, please try latter'

    },
    "zh": {
        HEADLINE : '这是我们的节日哦',
        INTRO_TEXT : 'And it has i18n support!',
        BUTTON_TEXT_EN: 'english',
        BUTTON_TEXT_ZH: '中文',
        Project: '我的项目',
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
        SaveFailedHeader: '保存失败'
    }
}

var trans=angular.module('Holu.translate', ['pascalprecht.translate']);
trans.config(function($translateProvider) {
    for(lang in translations){
        $translateProvider.translations(lang,translations[lang]);
    }
    $translateProvider.preferredLanguage('zh');
})