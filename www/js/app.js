// angular.module is a global place for creating, registering and retrieving Angular modules
// 'iPic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'iPic.services' is found in services.js
// 'iPic.controllers' is found in controllers.js
//ionic.Platform.ready();
var ben = angular.module('iPic', ['ionic', 'iPic.services', 'iPic.controllers'])

   .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
    })

    .config(function ($stateProvider, $urlRouterProvider) {


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            })

            .state('loginPage', {
                url: '/loginPage',
                templateUrl: 'templates/loginPage.html',
                controller: 'loginPageCtrl'
            })

            .state('registerPage', {
                url: '/registerPage',
                templateUrl: 'templates/registerPage.html',
                controller: 'registerPageCtrl'
            })

            .state('createPoll', {
                url: '/createPoll',
                templateUrl: 'templates/createPoll.html',
                controller: 'createPollCtrl'
            })

            .state('sendToPage', {
                url:'/sendToPage',
                templateUrl: 'templates/sendToPage.html',
                controller: 'sendToPageCtrl'
            })

            .state('contactsPage', {
                url:'/contactsPage',
                templateUrl: 'templates/contactsPage.html',
                controller: 'contactsPageCtrl'
            })

            .state('feedPage', {
                url:'/feedPage',
                templateUrl: 'templates/feedPage.html',
                controller: 'feedPageCtrl'
            })
            .state('showThePoll',{
                url:'/showThePoll',
                templateUrl: 'templates/showThePoll.html',
                controller: 'showThePollCtrl'
            })
            .state('settingsPage', {
                url:'/settingsPage',
                templateUrl: 'templates/settingsPage.html',
                controller: 'settingsPageCtrl'
            })
            .state('listFriendsPage',{
                url:'/listFriendsPage',
                templateUrl: 'templates/listFriendsPage.html',
                controller: 'listFriendsPageCtrl'
            })
            .state('searchPage',{
                url:'/searchPage',
                templateUrl: 'templates/searchPage.html',
                controller: 'searchPageCtrl'
            })
            .state('makeGroupsPage',{
                url:'/makeGroupsPage',
                templateUrl: 'templates/makeGroupsPage.html',
                controller: 'makeGroupsPageCtrl'
            })
            .state('instaPage',{
                url:'/instaPage',
                templateUrl: 'templates/instaPage.html',
                controller: 'instaPageCtrl'
            })
            .state("otherwise", {
                url: "/index",
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
           })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');


    });

ben.controller("ExampleController", function($scope, $ionicSlideBoxDelegate) {
    $scope.navSlide = function(index) {
        $ionicSlideBoxDelegate.slide(index, 500);
    }
});




