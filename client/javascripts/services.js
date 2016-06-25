app.service("NutritionService", function($http){
  return {
    getData: function() {
      // TO DO: 
      // Form validations

      // Makes request to backend with sample API request
      return $http.get('http://localhost:3000/foodData')
    }
  }
})
