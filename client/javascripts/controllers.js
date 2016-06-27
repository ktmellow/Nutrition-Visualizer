app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.foodData;
  vm.results;
  vm.macros;
  vm.vitamins;
  vm.minerals;
  vm.macroPie = "macroPie";
  vm.vitaminBar = "vitaminBar";
  vm.mineralBar = "mineralBar"
  vm.search = {};

  vm.submit = function(id) {
    var id = id || '01009';
    NutritionService.getData(id).then(function(data) {
      vm.foodData = data.data.parsed_body.report.food;
      vm.macros = NutritionService.getMacros(vm.foodData);
      vm.minerals = NutritionService.getMinerals(vm.foodData);
      vm.vitamins = NutritionService.getVitamins(vm.foodData);

      // For development, remove later
      window.foodData = vm.foodData;
      window.data = vm.data;
      window.macros = vm.macros;
      window.minerals = vm.minerals;
      window.vitamins = vm.vitamins;

      vm.results = data.data.parsed_body.report.food.name;

      // TO DO:
      // Display Bar Chart of Vitamins 
      // Display Bar Chart of Minerals
    });
  }

  vm.getSuggestions = function() {
    NutritionService.getSuggestions(vm.form.query).then(function(data) {
      vm.search.suggestions = data.data.parsed_body.list.item;
    });
  }

    
}]);
