const app = angular.module("nutritionApp", ['ngRoute']);

app.config(config)

function config($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'client/views/index.html',
      controller: 'NutritionController',
      controllerAs: 'vm'
    })
  $locationProvider.html5Mode(true);
}
