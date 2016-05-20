
var myApp = angular.module("myApp",['ngRoute','ngResource']);

myApp.config(function($routeProvider){
	$routeProvider
	
	.when('/',{
		templateUrl: 'assets/pages/angular.html',
		controller: 'mainController'
	})
	.when('/second/',{
		resolve: {
			check: function($rootScope,$location){
				if(!$rootScope.logedin){
					$location.path("/")	
				}
			}
		},
		templateUrl: 'assets/pages/second.html',
		controller: 'secondController'
	})
	
	.when('/second/:days',{
		resolve: {
			check: function($rootScope,$location){
				if(!$rootScope.logedin){
					$location.path("/")	
				}
			}
		},
		templateUrl: 'assets/pages/second.html',
		controller: 'secondController'
	})
	
});

myApp.service('cityService',function(){
	
	this.city = "Enugu,NG";
	
	
	this.getHttpObject = function(){
		var xhr;
		if (window.XMLHttpRequest) { // check for support
		// if it's supported, use it because it's better
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // check for the IE 6 Ajax
		// save it to the xhr variable
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		// spit out the correct one so we can use it
		return xhr;
	}
	
	this.ajaxCall = function(dataURL,cb){
		var request = this.getHttpObject();
		request.onreadystatechange = function(){
			if(request.readystate === 4 && request.status === 200){
				var examdata = JSON.parse(request.responseText);
				cb(examdata)				
			}
		}
		request.open("GET",dataURL, true);
		request.send(null);
	}
	
	this.getTheYear = function(thePaper,year){
		for(var i = 0; i < thePaper.length; i++){
			if(thePaper[i].id === year){
				return thePaper[i]
			}
		}
	};
	this.tochkeep = false;
	
});

	
myApp.controller("mainController",["$scope","$location","$rootScope","cityService",function($scope,$location,$rootScope,
cityService){
	$scope.city = cityService.city;
	$scope.$watch('city', function(){
		cityService.city = $scope.city;
	});
		
	$scope.submit = function(){
			
			if($scope.city !== ""){
				$rootScope.logedin = true;
				$location.path("/second/")
			}
				
	};
	
	$scope.format = function(){
		if($scope.city === ""){
			return "Enter the city name and country\'s name abbreviation e.g Enugu,NG which stands for Enugu,Nigeria."
		}
	}	
}]);

myApp.controller("secondController",["$scope","cityService","$resource","$routeParams","$location",function($scope,cityService,
$resource,$routeParams,$location){
	
	$scope.city = cityService.city;
	
	$scope.weatherApi = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?",{
	callback: "JSON_CALLBACK"},{get:{ method : "JSONP"}});
	
	$scope.weatherResult = $scope.weatherApi.get({ q : $scope.city, cnt : $scope.days, mode: "json",
	appid :"9081f638005a6bf04dae6abcab348146"});
	
	$scope.convertToCelcius = function(degC){
		return Math.round((((1.8 * (degC-273)) + 32) - 32)/1.8000);		
	};
	
	$scope.convertToDate = function(dt){
		return new Date(dt * 1000);
	};
	
	$scope.days = $routeParams.days || "2";
	$scope.two = function(){
		return $location.path("/second/2");
	}
	
	$scope.five = function(){
		return $location.path("/second/5");
	}
	
	$scope.seven = function(){
		return $location.path("/second/7");
	}
	
	
	console.log($scope.weatherResult)
}]);



