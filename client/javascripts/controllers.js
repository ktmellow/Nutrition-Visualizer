app.controller("NutritionController", ['NutritionService', 'D3Service', function(NutritionService, D3Service) {
  const vm = this;
  vm.form = {};
  vm.data;

  vm.submit = function(){
    // console.log(vm.form.query);
    NutritionService.getData().then(function(data) {
      vm.data = data.data.parsed_body.report.food;
      vm.data = NutritionService.getNutrients(vm.data);

      // For development, remove later
      window.data = vm.data;

      D3Service.macroPieMaker(NutritionService.getMacros(vm.data));
    });
  }
  
  // Display Bar Chart of Vitamins 

  // Display Bar Chart of Minerals



}]);
