var App = angular.module('app', ['ngRoute', 'ngAnimate']);

App.config(function($routeProvider) {
    $routeProvider
        // .when('/page/:pageId', {
        //     controller: 'pageController',
        //     templateUrl: function(params) {
        //         return 'views/page' + params.pageId + '.html';
        //     }
        // })
        .when('/', {
        	templateUrl: 'views/home.html',
        	controller:  'homeController'
        })
        .when('/e/:id', {
        	templateUrl: 'views/event.html',
        	controller:  'eventController'
        })
        .when('/new', {
        	templateUrl: 'views/new.html',
        	controller:  'newController'
        })
        .otherwise({
        	redirectTo: '/'
        });
});

App.controller("mainController", function ($scope, $http) {
	console.log("mainController")

	$scope.effect = "slide";
});

App.controller("homeController", function ($scope, $http) {
	console.log("homeController")

	$scope.name = window.localStorage.name;

	// onclick create

	// on find

	// get recent from localStorage
	var recent = window.localStorage.getItem("recent");
	$scope.recent = [];
	$scope.recent.push({ name: "meeting", id: "12b9d212" });
	$scope.recent.push({ name: "meetup #4", id: "230fh233" });
});

App.controller("newController", function ($scope, $http) {
	console.log("newController")

	var pageStates = ["name", "event", "timeframe", "share"];

	$scope.hasName = !!window.localStorage.name;

	$scope.pageState = "name";

	if ($scope.hasName) {
		$scope.pageState = "event";
	}

	$scope.submit = function() {
		// eventName
		// eventDetail
		// eventLocation
		// eventTimeframe
        if (this.eventName) {
        	window.localStorage.name = this.name;
    		$scope.$parent.next();
        }
    };

	$scope.next = function () {
		console.log(pageStates.indexOf($scope.pageState));
		$scope.pageState = pageStates[pageStates.indexOf($scope.pageState) + 1];
	};
});

App.controller("nameController", function ($scope, $http) {
	console.log("nameController")

	$scope.submit = function() {
        if (this.name) {
        	window.localStorage.name = this.name;
    		$scope.$parent.next();
        }
    };
});


App.controller("eventController", function ($scope, $http) {
	console.log("eventController")


});
