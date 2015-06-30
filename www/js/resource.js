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
        PullToFresh: 'Pull to Fresh ....'
    },
    "zh": {
        HEADLINE : '这是我们的节日哦',
        INTRO_TEXT : 'And it has i18n support!',
        BUTTON_TEXT_EN: 'english',
        BUTTON_TEXT_ZH: '中文',
        PROJECT_TEXT: '我的项目',
        News: '资讯',
        Posts: '贴吧',
        Notes: '日志',
        Documents: '文档',
        Status: '状态',
        PullToFresh: '下拉刷新 ....'
    }
}

var trans=angular.module('Holu.translate', ['pascalprecht.translate']);
trans.config(function($translateProvider) {
    for(lang in translations){
        $translateProvider.translations(lang,translations[lang]);
    }
    $translateProvider.preferredLanguage('en');
})