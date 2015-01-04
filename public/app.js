var App = angular.module('app', ['ngRoute', 'ngAnimate'], function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|whatsapp):/);
});

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

App.config(function ($compileProvider) {
		
});

App.filter("encodeURI", function ($window) {
	return $window.encodeURIComponent;
});

App.controller("mainController", function ($scope, $http) {
	console.log("mainController")

	$scope.effect = "slide";

	$scope.isPhone = (navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod/i));
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

	var pageStates = ["name", "event", "share"];

	$scope.hasName = !!window.localStorage.name;

	$scope.pageState = "name";
	$scope.shareData = {};

	if ($scope.hasName) {
		$scope.pageState = "event";
	}

	$scope.next = function () {
		$scope.pageState = pageStates[pageStates.indexOf($scope.pageState) + 1];
	};

	$scope.setShareData = function (data) {
		$scope.shareData = data;
		
		$scope.permalink = "http://" + location.host + "/#/e/" + data.id;
		$scope.whatsappText = data.name + " - " + $scope.permalink;
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

	$scope.submit = function() {
		// eventName
		// eventDetail
		// eventLocation
		// eventTimeframe
        
        if (this.eventName) {
        	var data = {};
        	data.name = this.eventName;
        	data.detail = this.eventDetail;

        	$http.post('/event', data).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					console.log("Event created", data);

					$scope.$parent.setShareData(data);
					$scope.$parent.next();
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.error("Something went wrong!");
					console.error(data);
				});
        }
    };
});
