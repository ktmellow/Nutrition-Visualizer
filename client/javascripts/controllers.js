app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.data;
  vm.results;
  vm.macros;
  vm.macroPie = "macroPie";
  vm.search = {};

  vm.submit = function(id) {
    var id = id || '01009';
    NutritionService.getData(id).then(function(data) {
      vm.data = data.data.parsed_body.report.food;
      vm.macros = NutritionService.getMacros(vm.data);

      // For development, remove later
      window.data = vm.data;
      window.macros = vm.macros

      vm.results = data.data.parsed_body.report.food.name;

      // TO DO:
      // Get data and display Bar Chart of Vitamins 
      // Get data and display Bar Chart of Minerals
    });
  }

  vm.getSuggestions = function() {
    NutritionService.getSuggestions(vm.form.query).then(function(data) {
      vm.search.suggestions = data.data.parsed_body.list.item;
      console.log(data.data.parsed_body.list)
    });
  }
  



}]);
