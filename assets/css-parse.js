var ParseCSS;

ParseCSS = (function() {
  
  "use strict";
  
  function ParseCSS(cssInput) {
    var returned;
    returned = this.rules(cssInput);
    returned = this.propertyValues(returned);
    
    return returned;
  }

  ParseCSS.prototype.rules = function(input) {
    return this.cleanArray(input.split(";"));
  };
  
  ParseCSS.prototype.propertyValues = function(input) {
    var data = {};
    var i = 0;
    
    while (i < input.length) {
      var item = input[i].split(":");
      var propertyName = item[0];
      var property = data[propertyName] = [];
      // Look for multiple values, split by comma if outside of brackets
      var values = item[1].split(new RegExp(",\\s*(?=[^)]*(?:\\(|$))", "g"));
      
      var j = 0;
      while (j < values.length) {
        var value = values[j];
        property.push(value.trim());
        j = j + 1;
      }
      
      i = i + 1;
    }
    
    return data;
  }
  
  ParseCSS.prototype.cleanArray = function(array) {
    var i = 0;
    
    while (i < array.length) {
      var item = array[i];
      var length = item.length;
      if (length === 0 || item === null) {
        array.splice(i, 1);
      };
      if (item.charAt(0) === "\n") {
        array[i] = item.substring(1, length);
      };
      i = i + 1;
    };
    
    return array;
  };

  return ParseCSS;
  
})();