'use strict';

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

App.controller("eventController", function ($scope, $http, data, recentService) {
	console.log("eventController")
  
  if (data) {
    console.log(data);
    $scope.data = data;
    
    recentService.addRecent({ name: data.name, id: data.id });

    $scope.permalink = "http://" + location.host + "/#/e/" + data.id;
    $scope.whatsappText = data.name + " - " + $scope.permalink;
  }
});

App.factory("Dates", function () {
	var Dates = {};

	Dates.data = null;

	Dates.events = [];

	Dates.addEvent = function (newEvent) {
		this.events.push(newEvent);
		console.log(this.events);
	}

	Dates.removeEvent = function (oldEvent) {
		for (var i = 0, len = this.events.length; i < len; i++) {
			if (this.events[i] && (new Date(this.events[i].date).getTime() == oldEvent.date.getTime())) {
				this.events.splice(i, 1);
				break;
			}
		}
		console.log(this.events);
	}

	Dates.clear = function () {
		this.data = null;
		this.events = [];
	}

	Dates.setData = function (data) {
		this.clear();
		this.data = data;
		this.events = data && data.events && data.events[window.localStorage.name] || [];
	}

	Dates.getMyEvents = function () {
		return this.events;
	}

	return Dates;
});

App.controller("voteController", function ($scope, $http, data, Dates, $location) {
  console.log("voteController")

  var self = this;
  
  if (data) {
    $scope.data = data;
    Dates.setData(data);
  }

  console.log(Dates)

  $scope.submit = function () {
  	$http.post("/vote/" + data.id, { name: window.localStorage.name, events: Dates.events }).
  		success(function (body, status, headers, config) {
  			Dates.clear();
  			console.log(body);
  			$location.path('/e/' + data.id);
  		}).
  		error(function (data, status, headers, config) {
  			console.error(data);
  		});
  }
});

App.controller("calendarController", function ($scope, Dates) {
  console.log("calendarController");

  console.log(Dates.data);

  var calendar = $('#calendar').clndr({
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
	},
	clickEvents: {
	    click: function(target) {
	    	if (target.element.className.indexOf("inactive") > -1) {
	    		return;
	    	}
	    	
	    	if (target.element.className.indexOf("event") > -1) {
		    	calendar.removeEvents(function(event) {
				  	return moment(event.date).toDate().getTime() == target.date.toDate().getTime();
				});
		    	Dates.removeEvent({ date: target.date.toDate(), title: '' });
	    	} else {
	    		calendar.addEvents([{ date: target.date, title: '' }]);
	    		Dates.addEvent({ date: target.date.toDate(), title: '' });
	    	}
	    }
	},
	events: Dates.getMyEvents()
  });

  window.calendar = calendar;
});

