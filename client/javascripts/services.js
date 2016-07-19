app.service("NutritionService", function($http, $location) {
  const dri = {
    "Water": {value: 1900, units: 'g'},
    "Sugars, total": {value: 25, units: "g"},
    "Total lipid (fat)": {value: 65, units: "g"},
    "Saturated Fat": {value: 20, units: "g"},
    "Cholesterol": {value: 300, units: "mg"},
    "Carbohydrate, by difference":  {value: 300, units: "g"},
    "Fiber, total dietary": {value: 25, units: "g"},
    "Protein": {value: 50, units: "g"},
    "Choline, total": {value: 550, units: "mg"},
    "Folate":  {value: 400, units: "µg"},
    "Folate, food":  {value: 400, units: "µg"},
    "Folate, total":  {value: 400, units: "µg"},
    "Folate, DFE":  {value: 400, units: "µg"},
    "Folic acid":  {value: 400, units: "µg"},
    "Biotin":  {value: 300, units: "µg"},
    "Vitamin A, IU": {value: 5000, units:"IU"},
    "Vitamin B-6": {value: 2, units: "mg"},
    "Vitamin B-6, added": {value: 2, units: "mg"},
    "Vitamin B-12": {value: 6, units: "µg"},
    "Vitamin B-12, added": {value: 6, units: "µg"},
    "Vitamin C, total ascorbic acid": {value: 60, units: "mg"},
    "Vitamin D": {value: 400, units: "IU"},
    "Vitamin D3 (cholecalciferol)": {value: 400, units: "IU"},
    "Vitamin D (D2 + D3)": {value: 400, units: "IU"},
    "Vitamin E": {value: 30, units: "IU"},
    "Vitamin E, added": {value: 30, units: "IU"},
    "Vitamin E (alpha-tocopherol)": {value: 30, units: "IU"},
    "Vitamin K (phylloquinone)": {value: 80, units: "µg"},
    "Thiamin": {value: 1.5, units: "mg"},
    "Riboflavin":  {value: 1.7, units: "mg"},
    "Niacin":  {value: 20, units: "mg"},
    "Pantothenic acid": {value: 10, units: "mg"},
    "Calcium, Ca": {value: 1000, units: "mg"},
    "Chromium, Cr":  {value: 120, units: "µg"},
    "Chloride, Cl":  {value: 3400, units: "mg"},
    "Copper, Cu":  {value: 2, units: "mg"},
    "Fluoride, F": {value: 4, units: "mg"},
    "Iron, Fe":  {value: 18, units: "mg"},
    "Iodine, I":  {value: 150, units: "µg"},
    "Magnesium, Mg": {value: 400, units: "mg"},
    "Manganese, Mn": {value: 2, units: "mg"},
    "Molybdenum, Mo":  {value: 75, units: "µg"},
    "Phosphorus, P": {value: 1000, units: "mg"},
    "Potassium, K": {value: 3500, units: "mg"},
    "Selenium, Se":  {value: 70, units: "µg"},
    "Sodium, Na":  {value: 2400, units: "mg"},
    "Zinc, Zn":  {value: 15, units: "mg"}
  }

  return {

    // Gets percentage of DRI
    getDri: function(dataset) {
      function grams(value, units) {
        if (units == 'mg') {
          return value * .001;
        } else if (units == 'mcg') {
          return 0.000001 * value;
        } else if (units == 'µg') {
          return 0.000001 * value;
        } else if (units == 'IU') {
          return value; 
        } else if (units == 'u00b5g') {
          return value * 0.000001;
        } else {
          return value;
        }
      }
      var gramsDri = grams(dataset.dri.value, dataset.dri.units);
      var gramsServing = grams(dataset.value, dataset.unit);
      return 100 * gramsServing / gramsDri;
    },

    getSuggestions: function(query) {
      console.log(query, 'query')
      // return $http.get(location.hostname + '/food/suggest?q=' + encodeURIComponent(query));
      return $http.get('http://localhost:3000/food/suggest?q='+ encodeURIComponent(query));
      // return $http.get('https://nutrition-vis.herokuapp.com/food/suggest?q='+ encodeURIComponent(query));
    },

    // Makes request to backend with sample API request
    getData: function(id) {
      // return $http.get(location.hostname + '/food/data?id='+id);
      return $http.get('http://localhost:3000/food/data?id='+id);
      // return $http.get('https://nutrition-vis.herokuapp.com/food/data?id='+id);

    },

    // Collects only the data necessary for the data visualization
    getNutrients: function(data) {
      return data.nutrients;
    },

    // Collects only macronutrients
    getMacros: function(data) {
      var macroNames = ['Protein', 'Total lipid (fat)', 'Ash', 'Carbohydrate, by difference', 
                        'Fiber, total dietary', 'Sugars, total', 'Water']
      return data.nutrients.reduce( function(obj, nutrient) {
        if ( macroNames.indexOf(nutrient.name) !== -1 ) { 
          obj[nutrient.name] = nutrient;
          obj[nutrient.name]['dri'] = dri[nutrient.name];
        };
        return obj;
      }, {});
    },
    
    // Collects calories data
    getCalories: function(data) {
      return data.nutrients.reduce(function(obj, nutrient) {
        if (nutrient.name == "Energy" && nutrient.unit == "kcal") { 
            obj = {"value": nutrient.value, "units": nutrient.unit, "dri": {"value": {"man": 2500, "woman": 2000 }, "units": "kcal"}}
        };
        return obj;
      }, {});
    },

    getWater: function(data) {
      return data.nutrients.reduce(function(obj, nutrient) {
        if(nutrient.name == "Water") {
          obj = {"value": nutrient.value, "units": nutrient.unit, "dri": {"value": 1900}}
        }
      })
    }, 

    getMinerals: function(data) {
      var mineralNames = ["Calcium, Ca", "Fluoride, F", "Copper, Cu", "Iron, Fe", "Potassium, K", "Phosphorus, P",
                          "Magnesium, Mg", "Manganese, Mn", "Selenium, Se", "Sodium, Na", "Zinc, Zn", "Iodine, I", 
                          "Chromium, Cr", "Chloride, Cl", "Molybdenum, Mo"]
      return data.nutrients.reduce(function(newObj, nutrient) {
        if ( mineralNames.indexOf(nutrient.name) !== -1 ) {
          newObj[nutrient.name] = nutrient;
          newObj[nutrient.name]['dri'] = dri[nutrient.name];
        }
        return newObj
      }, {});
    },

    getVitamins: function(data) {
      var vitaminNames = ["Vitamin A, IU", 
                          "Vitamin B-6", "Vitamin B-6, added", "Vitamin B-12", "Vitamin B-12, added",
                          "Vitamin D", "Vitamin D (D2 + D3)", "Vitamin D3 (cholecalciferol)",
                          "Vitamin E, added", "Vitamin E (alpha-tocopherol)", "Folate, DFE", "Folate, food", "Folate, total", 
                          "Vitamin K (phylloquinone)", "Riboflavin", "Thiamin", "Folic acid",
                          "Niacin", "Choline", "Choline, total", "Pantothenic acid", 
                          // "Carotene, beta", "Carotene, alpha", 
                          "Biotin", "Riboflavin"]
      return data.nutrients.reduce(function(newObj, nutrient) {
        if (vitaminNames.indexOf(nutrient.name)  !== -1) {
          newObj[nutrient.name] = nutrient;
          newObj[nutrient.name]['dri'] = dri[nutrient.name];
        } 
        return newObj;
      }, {});
    }  

  }
})

app.service("FillChartService", function(){
  return {
   liquidfillgauge: function(g, value, settings, element, fillType) {
      /*!
      *  Reference: x
       * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
       * Copyright (c) 2015, Curtis Bratton
       * All rights reserved.
       *
       * Liquid Fill Gauge v1.1
       */
      var idGenerator = (function() {
              var count = 0;
              return function(prefix) {
                  return prefix + "-" + count++;
              };
          })();
      var defaultConfig = {
              // Values
              minValue: 0, // The gauge minimum value.
              maxValue: 100, // The gauge maximum value.

              // Styles
              circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
              circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
              circleColor: "#178BCA", // The color of the outer circle.
              backgroundColor: null, // The color of the background
              waveColor: "#178BCA", // The color of the fill wave.
              width: 0, // You might want to set the width and height if it is not detected properly by the plugin
              height: 0,

              // Waves
              waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
              waveCount: 1, // The number of full waves per width of the wave circle.
              waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.

              // Animations
              waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
              waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
              waveRiseAtStart: true, // If set to false and waveRise at true, will disable only the initial animation
              waveAnimate: true, // Controls if the wave scrolls or is static.
              waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
              waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
              valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading and updating. If false, the final value is displayed.
              valueCountUpAtStart: true, // If set to false and valueCountUp at true, will disable only the initial animation

              // Text
              textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
              textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
              displayPercent: true, // If true, a % symbol is displayed after the value.
              textColor: "#045681", // The color of the value text when the wave does not overlap it.
              waveTextColor: "#A4DBf8", // The color of the value text when the wave overlaps it.
          };

      // Handle configuration
      var config = d3.map(defaultConfig);
      d3.map(settings).forEach(function(key, val) {
          config.set(key, val);
      });

      g.each(function(d) {
          var gauge = d3.select(this);

          var width = config.get("width") !== 0 ? config.get("width") : parseInt(gauge.style("width"));
          var height = config.get("height") !== 0 ? config.get("height") : parseInt(gauge.style("height"));
          var radius = Math.min(width, height) / 2;
          var locationX = width / 2 - radius;
          var locationY = height / 2 - radius;
          var fillPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), value)) / config.get("maxValue");

          var waveHeightScale;
          if (config.get("waveHeightScaling")) {
              waveHeightScale = d3.scale.linear()
                  .range([0, config.get("waveHeight"), 0])
                  .domain([0, 50, 100]);
          } else {
              waveHeightScale = d3.scale.linear()
                  .range([config.get("waveHeight"), config.get("waveHeight")])
                  .domain([0, 100]);
          }

          var textPixels = (config.get("textSize") * radius / 2);
          var textFinalValue = parseFloat(value).toFixed(2);
          var textStartValue = config.get("valueCountUp") ? config.get("minValue") : textFinalValue;
          var percentText = config.get("displayPercent") ? "%" : "";
          var circleThickness = config.get("circleThickness") * radius;
          var circleFillGap = config.get("circleFillGap") * radius;
          var fillCircleMargin = circleThickness + circleFillGap;
          var fillCircleRadius = radius - fillCircleMargin;
          var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

          var waveLength = fillCircleRadius * 2 / config.get("waveCount");
          var waveClipCount = 1 + config.get("waveCount");
          var waveClipWidth = waveLength * waveClipCount;

          // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
          var textRounder = function(value) {
              return Math.round(value);
          };
          if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
              textRounder = function(value) {
                  return parseFloat(value).toFixed(1);
              };
          }
          if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
              textRounder = function(value) {
                  return parseFloat(value).toFixed(0);
              };
          }

          // Data for building the clip wave area.
          var data = [];
          for (var i = 0; i <= 40 * waveClipCount; i++) {
              data.push({
                  x: i / (40 * waveClipCount),
                  y: (i / (40))
              });
          }

          // Scales for drawing the outer circle.
          var gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
          var gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

          // Scales for controlling the size of the clipping path.
          var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
          var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

          // Scales for controlling the position of the clipping path.
          var waveRiseScale = d3.scale.linear()
              // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
              // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
              // circle at 100%.
              .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
              .domain([0, 1]);
          var waveAnimateScale = d3.scale.linear()
              .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
              .domain([0, 1]);

          // Scale for controlling the position of the text within the gauge.
          var textRiseScaleY = d3.scale.linear()
              .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
              .domain([0, 1]);

          // Center the gauge within the parent SVG.
          var gaugeGroup = gauge.append("g")
              .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

          // Draw the background circle
          if (config.get("backgroundColor")) {
              gaugeGroup.append("circle")
                  .attr("r", radius)
                  .style("fill", config.get("backgroundColor"))
                  .attr('transform', 'translate(' + radius + ',' + radius + ')');
          }

          // Draw the outer circle.
          var gaugeCircleArc = d3.svg.arc()
              .startAngle(gaugeCircleX(0))
              .endAngle(gaugeCircleX(1))
              .outerRadius(gaugeCircleY(radius))
              .innerRadius(gaugeCircleY(radius - circleThickness));
          gaugeGroup.append("path")
              .attr("d", gaugeCircleArc)
              .style("fill", config.get("circleColor"))
              .attr('transform', 'translate(' + radius + ',' + radius + ')');

          // Text where the wave does not overlap.
          var text1 = gaugeGroup.append("text")
              .attr("class", "liquidFillGaugeText")
              .attr("text-anchor", "middle")
              .attr("font-size", textPixels + "px")
              .style("fill", config.get("textColor"))
              .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

          // The clipping wave area.
          var clipArea = d3.svg.area()
              .x(function(d) {
                  return waveScaleX(d.x);
              })
              .y0(function(d) {
                  return waveScaleY(Math.sin(Math.PI * 2 * config.get("waveOffset") * -1 + Math.PI * 2 * (1 - config.get("waveCount")) + d.y * 2 * Math.PI));
              })
              .y1(function(d) {
                  return (fillCircleRadius * 2 + waveHeight);
              });

          if(fillType === 'water') {
            var clipId = idGenerator("waterclipWave");
          } else {
            var clipId = idGenerator("clipWave");
          }
          var waveGroup = gaugeGroup.append("defs")
              .append("clipPath")
              .attr("id", clipId);
          var wave = waveGroup.append("path")
              .datum(data)
              .attr("d", clipArea);

          // The inner circle with the clipping wave attached.
          var fillCircleGroup = gaugeGroup.append("g")
              .attr("clip-path", "url("+ location.pathname + "#" + clipId + ")");
          fillCircleGroup.append("circle")
              .attr("cx", radius)
              .attr("cy", radius)
              .attr("r", fillCircleRadius)
              .style("fill", config.get("waveColor"));

          // Text where the wave does overlap.
          var text2 = fillCircleGroup.append("text")
              .attr("class", "liquidFillGaugeText")
              .attr("text-anchor", "middle")
              .attr("font-size", textPixels + "px")
              .style("fill", config.get("waveTextColor"))
              .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

          // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
          var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;

          if (config.get("waveAnimate")) {
              var animateWave = function() {
                  wave.transition()
                      .duration(config.get("waveAnimateTime"))
                      .ease("linear")
                      .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                      .each("end", function() {
                          wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                          animateWave();
                      });
              };
              animateWave();
          }

          var unit;
          if(fillType == "calories") {
            unit = 'kCal';
          } else {
            unit = 'mL'
          }

          var transition = function(from, to, riseWave, animateText) {
            // Update texts and animate
            if (animateText) {
                var textTween = function() {
                    var i = d3.interpolate(from, to);
                    return function(t) {
                        this.textContent = textRounder(i(t)) + percentText + ' ' + unit;
                    };
                };
                text1.transition()
                    .duration(config.get("waveRiseTime"))
                    .tween("text", textTween);
                text2.transition()
                    .duration(config.get("waveRiseTime"))
                    .tween("text", textTween);
            } else {
                  text1.text(textRounder(to) + percentText);
                  text2.text(textRounder(to) + percentText);
            }

            // Update the wave
            toPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), to)) / config.get("maxValue");
            fromPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), from)) / config.get("maxValue");

            if (riseWave) {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fromPercent) + ')')
                    .transition()
                    .duration(config.get("waveRiseTime"))
                    .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent) + ')');
            } else {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent) + ')');
            }
          };

          transition(
            textStartValue,
            textFinalValue,
            config.get("waveRise") && config.get("waveRiseAtStart"),
            config.get("valueCountUp") && config.get("valueCountUpAtStart")
          );

          // Event to update the value
          gauge.on("valueChanged", function(newValue) {
            transition(value, newValue, config.get("waveRise"), config.get("valueCountUp"));
            value = newValue;
          });

          gauge.on("destroy", function() {
            // Stop all the transitions
            text1.interrupt().transition();
            text2.interrupt().transition();
            waveGroup.interrupt().transition();
            wave.interrupt().transition();

            // Unattach events
            gauge.on("valueChanged", null);
            gauge.on("destroy", null);
          });
            
          // Creates tooltip
          var tooltip = d3.select(element[0])
            .append('div')          
            .attr('class', 'tooltip'); 
          // tooltip.append('div').attr('class', 'percent');   
          tooltip.append('div').attr('class', 'women');
          tooltip.append('div').attr('class', 'men');

          // Adds tooltip on mouseover. 
          d3.select(this).select('circle').on('mouseover', function(d) {
            // tooltip.select('.percent').html(d3.format('.1f')(100*value/settings.maxValue) + "% of Daily Recommended");
            tooltip.select('.women').html("Recommended for Females: 2000");
            tooltip.select('.men').html("Recommended for Men: 2500");
            tooltip.style('display', 'block');
          })

          d3.select(this).select('circle').on('mouseout', function() {
            tooltip.style('display', 'none');
          });

          // Tooltip will move with mouse
          d3.select(this).select('circle').on('mousemove', function(d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
              .style('left', (d3.event.layerX + 10) + 'px');
          });
      });
      }
    };
})

app.service('EvalService', function() {
  return {

    addNutrients: function(oldTotal, moreNutrients, amt, units, toGrams) {
      if (Object.keys(oldTotal).length === 0 && oldTotal.constructor === Object) {
        var newTotal = moreNutrients;
      } else {
        var newTotal = oldTotal;
      }
      for( var nutrient in moreNutrients ) {
        var totalAdded = toGrams(moreNutrients[nutrient], amt, units);
        // only hits this because always has property now 
        if(newTotal.hasOwnProperty(nutrient)) {
          newTotal[nutrient].value += totalAdded;
        } else {
          newTotal = moreNutrients[nutrient];
          newTotal[nutrient].value = totalAdded;
        }
      }
      return newTotal;
    },

    subtractNutrients: function(oldTotal, lessNutrients, amt, units, toGrams) {
      var newTotal = oldTotal;
      for( var nutrient in lessNutrients ) {
        var totalRemoved = toGrams(lessNutrients[nutrient], amt, units);
        newTotal[nutrient].value -= totalRemoved;
      }
      return newTotal;
    },

    addCalories: function(oldTotal, moreCals, amt, units, toGrams) {
      var newTotal = oldTotal;
      totalAdded = toGrams(moreCals, amt, units);
      newTotal.value = newTotal.value ? newTotal.value += totalAdded : totalAdded;
      return newTotal;
    },

    subtractCalories: function(oldTotal, lessCals, amt, units, toGrams) {
      var newTotal = oldTotal;
      var totalSubtracted = toGrams(lessCals, amt, units);
      newTotal.value -= totalSubtracted;
      return newTotal;
    }
  }
});

app.service('ConversionService', function() {
  return {
    toArr: function(obj) {
      var arr = [];
      for (var prop in obj) {
        arr.push(obj[prop]);
      }
      return arr;
    },

    // Applies user input for units and amount and converts to grams
    // Must divide by 100 because all measurements are per 100g of food
    toGrams: function(nutrient, amt, units) {
      if( units === 'fl oz' ) {
        return nutrient.value / 100 * amt * 29.5735 ;
      } else if ( units === 'oz' ) {
        return nutrient.value / 100 * amt * 28.3495;
      } else {
        return nutrient.value * amt / 100;
      }
    }
  }
})

