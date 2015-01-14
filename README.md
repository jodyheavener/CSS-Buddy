# CSS Buddy

A Sketch 3 plugin that allows you to use CSS on layers.

**Note: this plugin is still in early stages of development.**

![I am so sorry for this huge gif](https://dl.dropboxusercontent.com/s/k1nspcamay3tre0/CSSBuddyDemo.gif?dl=0)

## Usage

Once you install the plugin just select a layer on your canvas and run _Apply to Layer_. A text dialogue will prompt you to enter in CSS.

* Only use valid CSS properties – available properties listed below

    Do this:
    ```
    background: blue;
    opacity: 0.5;
    box-shadow: 0 10px 20px rgba(0,0,0,.13),0 4px 7px rgba(0,0,0,.2);
    ```

* Enter them as if you are already inside your selector

    Don't do this:
    ```
    .my-layer {
      background: blue;
      opacity: 0.5;
      box-shadow: 0 10px 20px rgba(0,0,0,.13),0 4px 7px rgba(0,0,0,.2);
    }
    ```

* Right now styles can only be applied to shapes. Support for applying styles to text and other layer types will be added eventually.
* If any styles fail to apply or are unsupported a dialogue box will alert you to the failed attempts afterward.
* The dialogue box has a checkbox labeled "Overwrite Fills, Borders, and Shadows?" – yeah it doesn't work yet. But it will.

### Multiple values
Fills, borders, and shadows can all accept comma-separated multiple values (demonstrated above). Technically all other styles will also accept multiple values, but the last of each set of values will overwrite the others. These rules also apply when declaring the property multiple times.

### Units
All values for size/length/amount are to be in pixel (`px`) unit, unless `0`. Using `em`s wouldn't work because we have no context/parent value. Support for other units will be added if it's logical and in high demand.

### Colors
Acceptable color formats are Hexadecimal (`#FF7F50`), RGB (`rgb(255, 127, 80)`), RGBa (`rgba(255, 127, 80, 1)`), and generic [color names](http://www.crockford.com/wrrrld/color.html) (`coral`). Support for HSL format will be added eventually.

## CSS properties
The following is a list of supported CSS properties that can be applied to a shape layer in Sketch:

**Note:** currently only shorthand properties work. I'd like to support other longhand properties at some point.

* `width`
* `height`
* `opacity`
* `background`
* `box-shadow`
* `border`
* `border-radius`

## Wish list

A small list of what I hope/plan to build in to the tool in the future...

* Obviously, expand on the basic features, like more CSS properties and their accepted values
* Specifically, I'd like to see support for applying gradients and background images
* Implement custom properties and values for styles that are not currently supported by CSS (lookin' at you, Zoom Blur and Blend Mode).
* Find a way to associate layers with class names so that when you change a class' ruleset it gets applied to all layers with that class
* Create layers using CSS, using the selector as the layer name (and possibly some custom properties), like:

    ```
    rectangle[name="My Rectangle"] {
      background: red;
      width: 100px;
      height: 150px;
    }
    text[name="My Text"] {
      content: "This is some text!"
      font-size: 20px;
    }
    ```

Please contribute to this if you want to!