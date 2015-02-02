![CSS Buddy](https://dl.dropboxusercontent.com/s/2u83ofppl6w1hxm/GHLogo.png)

A Sketch 3 plugin that allows you to use CSS on layers.

`v0.0.3`

**Note: this plugin is still in early stages of development.**

Click [riiiight here](https://dl.dropboxusercontent.com/s/k1nspcamay3tre0/CSSBuddyDemo.gif?dl=0) to see a demo (the gif bogged down this page).

## Usage

Once you install the plugin just select a layer on your canvas and run _Apply to Selected_ or press `Command` + `Shift` + `A`. A text dialogue will prompt you to enter in CSS.

* Only use available and valid CSS properties – available properties listed below

    Do this:
    ```
    background-color: blue;
    opacity: 0.5;
    box-shadow: 0 10px 20px rgba(0,0,0,.13), 0 4px 7px rgba(0,0,0,.2);
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

* Supported layer types are: **Shape**, **Text**, and **Artboard**.
* If any styles fail to apply or are unsupported a dialogue box will (err, should) alert you to the failed attempts afterward.


### Overwriting
The "Apply to Selected" dialogue has a checkbox labelled _"Overwrite Fills, Borders, and Shadows?"_. Check this to remove all of a property's existing styles before applying new ones.

### Multiple values
Fills, borders, and shadows can all accept comma-separated multiple values. This can come in handy when wanting to quickly apply multiple styles (`background: red, blue, green;`). Technically all other styles will also accept multiple values, but the last of each set of values will overwrite the others. These rules also apply when declaring the property multiple times.

### Units
All values for size/length/amount are to be in pixel (`px`) unit, unless using `0`, `initial`, or `none` (where applicable). Using `em`s wouldn't work because we have no context/parent value. Support for other units will be added if it's logical and in high demand.

_Note:_ Sketch does not allow setting layer dimensions to `0`, so `0` is disabled for width and height properties.

### Colors
Acceptable color formats are Hexadecimal (`#FF7F50`), RGB (`rgb(255, 127, 80)`), RGBa (`rgba(255, 127, 80, 1)`), and generic [color names](http://www.crockford.com/wrrrld/color.html) (`coral`). Support for HSL format will be added eventually.

## CSS properties
The following is a list of supported CSS properties that can be applied to a given layer in Sketch:

_Note:_ for the most part only shorthand properties work. Support for longhand properties will be added eventually.

### Shape

* `width`
* `height`
* `opacity`
* `box-shadow`
* `border-radius`
* `background` | `background-color` (fills only)
* `border` | `border-width/color` when only one border exists

### Text

* `opacity`
* `text-shadow`
* `line-height`
* `color`
* `letter-spacing`
* `text-transform`
* `line-height`

### Artboard

* `width`
* `height`
* `background` | `background-color` (fills only)

## Going forward

**Writing a CSS parser is hard**, and for that reason I completely acknowledge that this tool is going to have a multitude of bugs and will never be as flexible as true web CSS. I encourage anyone who is interested to contribute to this project.

Here is a small list of what I hope/plan to build in to the tool in the future...

* [Started] Obviously, expand on the basic features, like more CSS properties and their accepted values
* Specifically, I'd like to see support for applying gradients and background images
* Implement custom properties and values for styles that are not currently supported by CSS (lookin' at you, Zoom Blur and Blend Mode).
* Find a way to associate layers with class names so that when you change a class' ruleset it gets applied to all layers with that class
* [Started] Create layers using CSS, using the selector as the layer name (and possibly some custom properties), like:

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

## Changelog

* v0.0.3 - January 31st 2015
  * Added support for Artboard and Text Layers, and more property values for the respective layer types
  * Added keyboard shortcuts to apply styles and create layers
  * Updated branding
* v0.0.2 - January 15th 2015
  * Rewritten code-base
  * Increased flexibility when adding new property values
  * Started "Create Layer" feature - putting on hold for now
* v0.0.1 - January 13th 2015
  * Initial release - Shapes only

**Known Issues ¯\\_(ツ)_/¯**

* Text layers don't always refresh when a style is applied.
