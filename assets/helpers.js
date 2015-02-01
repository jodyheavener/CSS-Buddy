// Get the page currently in view
var page = doc.currentPage()

var canvas = page.currentArtboard() ? page.currentArtboard() : page;

// Pathes for plugin currently in use, as well as the root folder
var pluginPath = sketch.scriptPath.substring(0, sketch.scriptPath.lastIndexOf("/"))

// Create a base COSAlertWindow
function alertWindow(canCancel) {
  var modal = COSAlertWindow.new()

  var icon = NSImage.alloc().initByReferencingFile(pluginPath + "/assets/icon.ico")
  modal.setIcon(icon)

  if (canCancel) {
    modal.addButtonWithTitle("Continue")
    modal.addButtonWithTitle("Cancel")
  } else {
    modal.addButtonWithTitle("OK")
  }

  return modal
}

// A quick way to get the value of text fields in the alerts
function valueAtIndex(view, index) {
  return view.viewAtIndex(index).stringValue()
}

// Get the size of an object
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Return an array object as an array
function arrayObjectInfo(object) {
  for(var name in object) {
    return [name, object[name]];
  }
}

// Return Index of partial match in array
function arraySearch(array, query) {
  var i = 0;
  while (i < array.length) {
    if (array[i].indexOf(query) != -1) {
      return i;
    };
    i = i + 1;
  }
  return -1;
}
