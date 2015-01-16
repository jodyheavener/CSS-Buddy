var ApplyCSS;

ApplyCSS = (function() {

  "use strict";

  function ApplyCSS(layer, type, rules, overwrite) {
    this.layer = layer;
    this.overwrite = Number(overwrite);
    this.propertyGroups = {};
    this.unhandled = [];
    this.apply._this = this;

    for (var rule in rules) {
      this.sortProperty(rule, rules[rule]);
    };

    for (var propertyType in this.propertyGroups) {
      this.applyProperties(propertyType, this.propertyGroups[propertyType]);
    };

    doc.reloadInspector();

    return {
      unhandled: this.unhandled,
      length: this.unhandled.length
    };
  };

  /*
   * Sort like-properties in to groups
   */
  ApplyCSS.prototype.sortProperty = function(property, value) {
    var propertyType, propertyValuePair = {};

    if (value.constructor == Array) {
      // Handle multiple values
      if (value.length > 1) {
        var i = 0;
        while (i < value.length) {
          this.sortProperty(property, value[i]);
          i = i + 1;
        };
        return;
      };
      value = value[0];
    };

    propertyValuePair[property] = value;

    switch (true) {
      case property.indexOf("opacity") != -1:
        propertyType = "opacity"; break;
      case property.indexOf("background") != -1:
        propertyType = "background"; break;
      case property.indexOf("box-shadow") != -1:
        propertyType = "box-shadow"; break;
      case property.indexOf("radius") != -1:
        propertyType = "border-radius"; break;
      case property.indexOf("border") != -1:
        propertyType = "border"; break;
      case property.indexOf("width") != -1:
        propertyType = "width"; break;
      case property.indexOf("height") != -1:
        propertyType = "height"; break;
    };

    if (propertyType) {
      var overwriteableTest = /box-shadow|border|background/.exec(propertyType)
      if (this.overwrite == 1 && overwriteableTest && overwriteableTest.length) this.cleanLayer(propertyType);
      if (!this.propertyGroups[propertyType]) this.propertyGroups[propertyType] = [];
      this.propertyGroups[propertyType].push(propertyValuePair);
    } else {
      this.unhandled.push(propertyValuePair);
    };
  };

  /*
   * Handle an object of CSS style rules
   */
  ApplyCSS.prototype.applyProperties = function(propertyType, propertiesArray) {
    var i = 0;
    while (i < propertiesArray.length) {
      var rule, propertyInfo, applicationResult;

      rule = propertiesArray[i];
      propertyInfo = arrayObjectInfo(rule);
      applicationResult = this.apply[propertyType](propertyInfo[0], propertyInfo[1]);

      if (!applicationResult) this.unhandled.push(rule);

      i = i + 1;
    };
  };

  /*
   * Generate an MSColor from a string input
   */
  ApplyCSS.prototype.MSColor = function(string) {
    var color, components, test;

    if (string.indexOf("#") != -1) {
      color = MSColor.colorWithSVGString(string);
    } else if (string.indexOf("rgb") != -1) {
      components = string.substring(string.indexOf('(') + 1, string.lastIndexOf(')')).split(/,\s*/);
      color = MSColor.colorWithSVGString("rgb(" + components[0] + "," + components[1] + "," + components[2] + ")");
      if (components[3]) color.alpha = components[3];
    } else {
      test = MSColor.colorWithSVGString(string);
      if (test) color = test;
    };

    return color;
  };

  /*
   * Remove styles applied to layer
   */
  ApplyCSS.prototype.cleanLayer = function(type) {
    switch (type) {
      case "box-shadow":
        this.layer.style().shadows().removeAllObjects();
        this.layer.style().innerShadows().removeAllObjects();
        break;
      case "background":
        this.layer.style().fills().removeAllObjects();
        break;
      case "border":
        this.layer.style().borders().removeAllObjects();
        break;
    }
  };

  /*
   * Parse and attempt to extract a property's string value for applicable styles
   */
  ApplyCSS.prototype.parseValue = function(string, applicable) {
    var values, i, data = {};

    values = string.split(" ");

    i = 0;
    while (i < values.length) {

    }
  };

  /*
   * Set up our apply methods object
   */
  ApplyCSS.prototype.apply = {};

  /*
   * Apply width value
   */
  ApplyCSS.prototype.apply.width = function(property, value) {
    var valueNoUnit = parseInt(value);

    // No min/max width
    // We can't process initial value
    // Sketch doesn't allow setting a 0px width
    if (property != "width" || value == "initial" || valueNoUnit == 0 || value == "0px" || value.indexOf("px") == -1 ) return false;

    this._this.layer.frame().width = valueNoUnit;

    return true;
  };

  /*
   * Apply height value
   */
  ApplyCSS.prototype.apply.height = function(property, value) {
    var valueNoUnit = parseInt(value);

    // No min/max width
    // We can't process initial value
    // Sketch doesn't allow setting a 0px width
    if (property != "height" || value == "initial" || valueNoUnit == 0 || value == "0px" || value.indexOf("px") == -1 ) return false;

    this._this.layer.frame().height = valueNoUnit;

    return true;
  };

  /*
   * Apply opacity value
   *
   * TODO: Don't change blendMode - use existing
   */
  ApplyCSS.prototype.apply.opacity = function(property, value) {
    var setContext;

    if (property != "opacity") return false;

    if (value == "initial") {
      value = 1;
    } else if (parseFloat(value) != Number(value)) {
      return false;
    };

    setContext = MSGraphicsContextSettings.new();
    setContext.opacity = value;
    setContext.blendMode = 0;

    this._this.layer.style().contextSettings = setContext;

    return true;
  };

  /*
   * Apply corner radius
   *
   * TODO: Implement individual corners
   */
  ApplyCSS.prototype.apply["border-radius"] = function(property, value) {
    var i, shape, radiusValues;
    value = value.split(" ");

    if (property != "border-radius") return false;

    // Radius only works on Rects
    shape = this._this.layer.layers().firstObject();
    if (!shape || !shape.isKindOfClass(MSRectangleShape)) return false;

    if (value[0] == "initial") {
      shape.setCornerRadiusFromComponents("0/0/0/0")
      return true;
    };

    i = 0;
    while (i < value.length) {
      if (value[i].indexOf("px") != -1 || value[i] == "0") {
        value[i] = parseInt(value[i]);
      } else {
        return false;
      };
      i = i + 1;
    }

    switch (value.length) {
      case 1:
        radiusValues = (value[0] + "/" + value[0] + "/" + value[0] + "/" + value[0]);
        break;
      case 2:
        radiusValues = (value[0] + "/" + value[1] + "/" + value[0] + "/" + value[1]);
        break;
      case 3:
        radiusValues = (value[0] + "/" + value[1] + "/" + value[2] + "/" + value[2]);
        break;
      case 4:
        radiusValues = (value[0] + "/" + value[1] + "/" + value[2] + "/" + value[3]);
        break;
    }

    shape.setCornerRadiusFromComponents(radiusValues);

    return true;
  };

  /*
   * Apply a border
   */
  ApplyCSS.prototype.apply.border = function(property, value) {
    var propertyTest, borders, widthPosition, width, stylePosition, color, border;
    value = value.split(" ");

    // If only one border exists on that layer, we can do color or width
    propertyTest = /color|width/.exec(property);
    if (propertyTest && propertyTest.length) {
      borders = this._this.layer.style().borders().array();

      if (borders.count() != 1) return false;

      if (property == "border-color") {
        color = this._this.MSColor(value[0]);
        if (!color) return false;
        this._this.layer.style().borders().objectAtIndex(0).color = color;
        return true;
      };

      if (property == "border-width") {
        this._this.layer.style().borders().objectAtIndex(0).thickness = parseInt(value[0]);
        return true;
      };
    };

    if (property != "border") return false;

    if (value[0] == "initial" || value[0] == "none") {
      this._this.layer.style().borders().removeAllObjects();
      return true;
    };

    widthPosition = arraySearch(value, "px");
    if (widthPosition == -1) return false;
    width = parseInt(value[widthPosition]);
    value.splice(widthPosition, 1);

    stylePosition = arraySearch(value, "solid");
    if (stylePosition != -1) value.splice(stylePosition, 1);

    // There should only be one property left, if any. Abort anything else.
    if (value.length > 1) return false;

    color = this._this.MSColor((value[0] ? value[0] : "black"));
    if (!color) return false;

    border = this._this.layer.style().borders().addNewStylePart();
    border.position = 2;
    border.color = color;
    border.thickness = width;

    return true;
  };

  /*
   * Apply a box shadow (inset and outset)
   *
   * TODO: Reverse order applied to reflect CSS order
   */
  ApplyCSS.prototype.apply["box-shadow"] = function(property, value) {
    var shadow, inset, sizeMatch, sizeParams, color;

    if (value == "initial" || value == "none") {
      this._this.layer.style().shadows().removeAllObjects();
      this._this.layer.style().innerShadows().removeAllObjects();
      return true;
    };

    if (value.indexOf("inset") != -1) {
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
      if (param == "0") {
        sizeParams[i] = param;
      } else if (param.indexOf("px") != -1) {
        sizeParams[i] = param.substr(0, param.indexOf("px"));
      } else {
        return true;
      }
      i = i +1;
    }

    color = this._this.MSColor(value.trim());
    if (!color) return true;

    if (inset) {
      shadow = this._this.layer.style().innerShadows().addNewStylePart();
    } else {
      shadow = this._this.layer.style().shadows().addNewStylePart();
    }

    shadow.color = color;
    shadow.offsetX = sizeParams[0];
    shadow.offsetY = sizeParams[1];
    if (sizeParams[2]) shadow.blurRadius = sizeParams[2];
    if (sizeParams[3]) shadow.spread = sizeParams[3];

    return true;
  };

  /*
   * Apply a background as a fill
   *
   * TODO: Add support for background image (import the image from URL)
   * TODO: Add support for gradient background
   */
  ApplyCSS.prototype.apply.background = function(property, value) {
    var color, background;

    if (property != "background" && property != "background-color") return false;

    if (value == "initial") {
      this._this.layer.style().fills().removeAllObjects();
      return true;
    };

    color = this._this.MSColor(value);
    if (!color) return false;

    background = this._this.layer.style().fills().addNewStylePart();
    background.fillType = 0;
    background.color = color;

    return true;
  };

  return ApplyCSS;

})();