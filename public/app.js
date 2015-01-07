var App = angular.module('scheduling', ['ngRoute', 'ngAnimate'], function ($compileProvider) {
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
        .when('/settings', {
          templateUrl: 'views/settings.html',
          controller:  'settingsController'
        })
        .when('/e/:id', {
        	templateUrl: 'views/event.html',
        	controller:  'eventController',
        	resolve: {
    				data: function ($q, $http, $route) {
    					var deferred = $q.defer();

    					$http.get('/event/' + $route.current.params.id).
    						success(function(data, status, headers, config) {
    							deferred.resolve(data);
    						}).
    						error(function(data, status, headers, config) {
    							deferred.resolve({});
    					});

    					return deferred.promise;
    				}
    			}
        })
        .when('/v/:id', {
          templateUrl: 'views/vote.html',
          controller:  'voteController',
          resolve: {
            data: function ($q, $http, $route) {
              var deferred = $q.defer();

              $http.get('/vote/' + $route.current.params.id).
                success(function(data, status, headers, config) {
                  deferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                  deferred.resolve({});
              });

              return deferred.promise;
            }
          }
        })
        .when('/new', {
        	templateUrl: 'views/new.html',
        	controller:  'newController'
        })
        .otherwise({
        	redirectTo: '/'
        });
});

App.filter("encodeURI", function ($window) {
	return $window.encodeURIComponent;
});

App.controller("mainController", function ($scope, $http) {
	console.log("mainController")

	$scope.effect = "slide";

	// hide whatsapp button on desktops
	$scope.isPhone = (navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod/i));
});

App.controller("homeController", function ($scope, $http, recentService, $window) {
	console.log("homeController")

	$scope.name = $window.localStorage.name || "anonymous";

	// onclick create

	// on find

	// Get recent from localStorage
  $scope.recent = recentService.getRecent();
  $scope.showRecent = !!$scope.recent.length;
});

App.controller("newController", function ($scope, $http, $window, $location) {
	console.log("newController")

	var pageStates = ["name", "event"];

	$scope.hasName = !!$window.localStorage.name;

	$scope.pageState = "name";
	$scope.shareData = {};

	if ($scope.hasName) {
		$scope.pageState = "event";
	}

	$scope.next = function () {
		if (pageStates.indexOf($scope.pageState) == pageStates.length - 1) {
			return;
		}

		$scope.pageState = pageStates[pageStates.indexOf($scope.pageState) + 1];
	};

	$scope.submitEvent = function() {
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

    					$location.path('/e/' + data.id);
    				}).
    				error(function(data, status, headers, config) {
    					// called asynchronously if an error occurs
    					// or server returns response with an error status.
              alert("Unable to save event. Please try again.")
    					console.error("Something went wrong!");
    					console.error(data);
    				});
        }
    };
});

App.controller("nameController", function ($scope, $http, $window) {
	console.log("nameController")

	$scope.submit = function() {
    if (this.name) {
    	$window.localStorage.name = this.name;
		  $scope.$parent.next();
    }
  };
});

App.controller("settingsController", function ($scope, $http, $window) {
  console.log("settingsController")

  $scope.name = $window.localStorage.name;

  $scope.change = function() {
    console.log("asdf");
    if (this.name) {
      $window.localStorage.name = this.name;
    }
  };

  $scope.clearRecent = function () {
    delete $window.localStorage.recent;
  }

  $scope.back = function () {
    $window.history.back();
  }
});


App.controller("eventController", function ($scope, $http, data, recentService) {
	console.log("eventController")
  
  if (data) {
    $scope.data = data;
    
    recentService.addRecent({ name: data.name, id: data.id });

    $scope.shareData = data;
      
    $scope.permalink = "http://" + location.host + "/#/e/" + data.id;
    $scope.whatsappText = data.name + " - " + $scope.permalink;
  }
});

App.controller("voteController", function ($scope, $http, data, recentService) {
  console.log("voteController")
  
  if (data) {
    $scope.data = data;
  }
});

App.service("recentService", function () {
  var recent = [];

  this.getRecent = function () {
    recent = window.localStorage.recent ? JSON.parse(window.localStorage.recent) : [];
    return recent;
  }

  this.addRecent = function (data) {
    // Remove existing event from recent
    for (var i in recent) {
      if ((recent[i] && recent[i].id) == (data && data.id)) {
        recent.splice(recent.indexOf(recent[i]), 1);
      }
    }

    // Add event to recent
    data.timestamp = new Date();
    recent.unshift(data);
    window.localStorage.recent = JSON.stringify(recent);
  }
});

App.controller("calendarController", function ($scope) {
  console.log("calendarController");

  $('#calendar').clndr({
  	template: $("#calendar-template").html(),
  	startWithMonth: moment(),
  	// forceSixRows: true,
  	showAdjacentMonths: true,
  	targets: {
		nextButton: 'clndr-next-button',
		previousButton: 'clndr-previous-button',
		nextYearButton: 'clndr-next-year-button',
		previousYearButton: 'clndr-previous-year-button',
		todayButton: 'clndr-today-button',
		day: 'day',
		empty: 'empty'
	},
  	constraints: {
	    startDate: moment(),
	    endDate: moment().add(3, 'M')
	  }
  });
});