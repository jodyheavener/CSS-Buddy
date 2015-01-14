var ApplyCSS;

ApplyCSS = (function() {
  
  "use strict";
  
  function ApplyCSS(layer, rules, overwrite) {
    this.unhandled = {};
    this.unhandledCount = 0;
    this.layer = layer;
    this.overwrite = overwrite; // Unimplemented

    for (var rule in rules) {
      this.handleRule(rule, rules[rule]);
    };
    
    doc.reloadInspector();
    return [this.unhandledCount, this.unhandled];
  };

  /*
   * Handle an object of CSS style rules
   */
  ApplyCSS.prototype.handleRule = function(property, value) {
    if (value.constructor === Array) {
      // Handle multiple values
      if (value.length > 1) {
        var i = 0;
        while (i < value.length) {
          this.handleRule(property, value[i]);
          i = i + 1;
        };
        return;
      } else {
        value = value[0];
      };
    };

    var handlerFailed;

    switch (property) {
      case "width":
        handlerFailed = this.applyWidth(value); break;
      case "height":
        handlerFailed = this.applyHeight(value); break;
      case "opacity":
        handlerFailed = this.applyOpacity(value); break;
      case "background":
        handlerFailed = this.applyBackground(value); break;
      case "box-shadow":
        handlerFailed = this.applyBoxShadow(value); break;
      case "border":
        handlerFailed = this.applyBorder(value); break;
      case "border-radius":
        handlerFailed = this.applyBorderRadius(value); break;
      default:
        handlerFailed = true;
    };

    if (handlerFailed) {
      this.unhandledCount = this.unhandledCount + 1;
      this.unhandled[property] = value;
    }
  };

  /*
   * Convert CSS colors to MSColor
   * 
   * TODO: Needs HSL color support
   */
  ApplyCSS.prototype.MSColor = function(string) {
    var color;
    if (string.indexOf("#") !== -1) {
      color = MSColor.colorWithSVGString(string);
    } else if (string.indexOf("rgb") !== -1) {
      var components = string.substring(string.indexOf('(') + 1, string.lastIndexOf(')')).split(/,\s*/);
      color = MSColor.colorWithSVGString("rgb(" + components[0] + "," + components[1] + "," + components[2] + ")");
      if (components[3]) {
        color.alpha = components[3];
      };
    } else {
      var test = MSColor.colorWithSVGString(string);
      if (test) {
        color = test;
      }
    };
    return color;
  };

  /*
   * Return Index of partial match in array
   */
  ApplyCSS.prototype.arraySearch = function(array, query) {
    var i = 0;
    while (i < array.length) {
      if (array[i].indexOf(query) !== -1) {
        return i;
      };
      i = i + 1;
    }
    return -1;
  }

  /*
   * Apply width value
   */
  ApplyCSS.prototype.applyWidth = function(value) {
    if (value.indexOf("px") !== -1) {
      value = value.substr(0, value.indexOf("px"));
    } else {
      return true;
    };
    this.layer.frame().width = value;
  };

  /*
   * Apply height value
   */
  ApplyCSS.prototype.applyHeight = function(value) {
    if (value.indexOf("px") !== -1) {
      value = value.substr(0, value.indexOf("px"));
    } else {
      return true;
    };
    this.layer.frame().height = value;
  };

  /*
   * Apply opacity value
   * 
   * TODO: Don't change blendMode - use existing
   */
  ApplyCSS.prototype.applyOpacity = function(value) {
    var setContext;

    setContext = MSGraphicsContextSettings.new();
    setContext.opacity = value;
    setContext.blendMode = 0;

    this.layer.style().contextSettings = setContext;
  };

  /*
   * Apply corner radius
   * 
   * TODO: Implement individual corners
   */
  ApplyCSS.prototype.applyBorderRadius = function(value) {
    var i, shape, radiusValues;
    value = value.split(" ");

    // Radius only works on Rects
    shape = this.layer.layers().firstObject();
    if (!shape || !shape.isKindOfClass(MSRectangleShape)) return true;

    i = 0;
    while (i < value.length) {
      if (value[i].indexOf("px") !== -1) {
        value[i] = Number(value[i].substr(0, value[i].indexOf("px")));
      } else if (value[i] === "0") {
        value[i] = Number(value[i]);
      } else {
        return true;
      };
      i = i + 1;
    }

    switch (value.length) {
      case 1: radiusValues = (value[0] + "/" + value[0] + "/" + value[0] + "/" + value[0]);
      case 2: radiusValues = (value[0] + "/" + value[1] + "/" + value[0] + "/" + value[1]);
      case 3: radiusValues = (value[0] + "/" + value[1] + "/" + value[2] + "/" + value[2]);
      case 4: radiusValues = (value[0] + "/" + value[1] + "/" + value[2] + "/" + value[3]);
    }

    shape.setCornerRadiusFromComponents(radiusValues)
  };

  /*
   * Apply a background as a fill
   * 
   * TODO: Add support for background image (import the image from URL)
   * TODO: Add support for gradient background
   */
  ApplyCSS.prototype.applyBackground = function(value) {
    var color, background;

    color = this.MSColor(value);
    if (!color) return true;

    background = this.layer.style().fills().addNewStylePart();
    background.fillType = 0;
    background.color = color;
  };

  /*
   * Apply a solid border
   * 
   * TODO: Add some sort of detection for Center/Inside/Outside position
   */
  ApplyCSS.prototype.applyBorder = function(value) {
    var widthPosition, width, stylePosition, color, border;
    value = value.split(" ");

    widthPosition = this.arraySearch(value, "px");
    if (widthPosition === -1) return true;
    width = value[widthPosition];
    width = width.substr(0, width.indexOf("px"));
    value.splice(widthPosition, 1);

    stylePosition = this.arraySearch(value, "solid");
    if (stylePosition === -1) return true;
    value.splice(stylePosition, 1);

    color = this.MSColor(value[0]);
    if (!color) return true;

    border = this.layer.style().borders().addNewStylePart();
    border.position = 2;
    border.color = color;
    border.thickness = width;
  };

  /*
   * Apply a box shadow (inset and outset)
   * 
   * TODO: Reverse order applied to reflect CSS order
   */
  ApplyCSS.prototype.applyBoxShadow = function(value) {
    var shadow, inset, sizeMatch, sizeParams, color;

    if (value.indexOf("inset") !== -1) {
      inset = true;
      value = value.replace("inset", "");
    }

    sizeMatch = value.match(new RegExp("((-?\\d+(?:\\.\\d*)?)(px)?,? ?){2,4}"))[0];
    sizeParams = sizeMatch.trim().split(" ");
    value = value.replace(sizeMatch, "");
    if (sizeParams.length < 2) return true;

    var i = 0;
    while (i < sizeParams.length) {
      var param = sizeParams[i];
      if (param === "0") {
        sizeParams[i] = param;
      } else if (param.indexOf("px") !== -1) {
        sizeParams[i] = param.substr(0, param.indexOf("px"));
      } else {
        return true;
      }
      i = i +1;
    }

    color = this.MSColor(value.trim());
    if (!color) return true;

    if (inset) {
      shadow = this.layer.style().innerShadows().addNewStylePart();
    } else {
      shadow = this.layer.style().shadows().addNewStylePart();
    }

    shadow.color = color;
    shadow.offsetX = sizeParams[0];
    shadow.offsetY = sizeParams[1];
    if (sizeParams[2]) shadow.blurRadius = sizeParams[2];
    if (sizeParams[3]) shadow.spread = sizeParams[3];
  };

  return ApplyCSS;
  
})();