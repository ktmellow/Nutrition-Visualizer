const app = angular.module("nutritionApp", ['ngRoute', 'ui.bootstrap']);
app.config(config)

function config($routeProvider, $locationProvider) {
  $routeProvider
    .when('/eval', {
      templateUrl: 'client/views/eval.html',
      controller: 'EvalController',
      controllerAs: 'vm'
    })
    .when('/', {
      templateUrl: 'client/views/index.html',
      controller: 'NutritionController',
      controllerAs: 'vm'
    })    
    .otherwise({redirectTo: '/'})
  $locationProvider.html5Mode(true);
}
