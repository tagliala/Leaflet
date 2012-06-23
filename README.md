<img src="http://leaflet.cloudmade.com/docs/images/logo.png" alt="Leaflet" />

Leaflet is a modern, lightweight open-source JavaScript library for mobile-friendly interactive maps, developed by [CloudMade](http://cloudmade.com) to form the core of its next generation JavaScript API. Weighting just about 21kb of gzipped JS code, it still has all the [features](http://leaflet.cloudmade.com/features.html) you will ever need for your web mapping needs while providing a fast, smooth, pleasant user experience.

It is built from the ground up to work efficiently and smoothly on both desktop and mobile platforms like iOS and Android, utilizing cutting-edge technologies included in HTML5 and CSS3, focusing on usability, performance, small size, [A-grade](http://developer.yahoo.com/yui/articles/gbs/) browser support, flexibility and [easy to use API](http://leaflet.cloudmade.com/reference.html). The OOP-based code of the library is designed to be modular, extensible and very easy to understand.

Check out the website for more information: [leaflet.cloudmade.com](http://leaflet.cloudmade.com)

## Contributing to Leaflet
Let's make the best open-source library for maps that can possibly exist!

Contributing is simple: make the changes in your fork, make sure that Leaflet builds successfully (see below) and then create a pull request to [Vladimir Agafonkin](http://github.com/mourner) (Leaflet maintainer). Updates to Leaflet [documentation](http://leaflet.cloudmade.com/reference.html) and [examples](http://leaflet.cloudmade.com/examples.html) (located in the `gh-pages` branch) are really appreciated too.

Here's [a list of the awesome people](http://github.com/CloudMade/Leaflet/contributors) that joined us already. Looking forward to _your_ contributions!

## Building Leaflet
Leaflet build system is powered by the Node.js platform and Jake, JSHint and UglifyJS libraries, which install easily and work well across all major platforms. Here are the steps to install it:

 1. [Download and install Node](http://nodejs.org)
 2. Run the following commands in the command line:

 ```
 npm install -g jake
 npm install jshint
 npm install uglify-js
 ```

Now that you have everything installed, run `jake` inside the Leaflet directory. This will check Leaflet source files for JavaScript errors and inconsistencies, and then combine and compress it to the `dist` folder.

To make a custom build of the library with only the things you need, use the build helper (`build/build.html`) to choose the components (it figures out dependencies for you) and then run the command generated with it.

If you add any new files to the Leaflet source, make sure to also add them to `build/deps.js` so that the build system knows about them. Happy coding!

## CSS icon sprite
This fork provides a css icon sprite by default. Loading images will require only one http request of 4 kb instead of six http requests of about 11 kb.
The ```DivIcon``` class was extended to support shadows (through the boolean option ```shadow```, set at ```false``` by default).

In order to instantiate a new set of icons with your sprite, you must follow those steps.

JavaScript:
```js
// This example uses sizes and anchor points for
// Nicolas Mollet's map icons collection,
// tiled horizontally in a single css sprite
var MyIconSprite = L.DivIcon.extend({
  options: {
    iconSize: new L.Point(32,37),
    iconAnchor: new L.Point(16,35)
  }
});
var homeIcon = new MyIconSprite({ className: "mysprite-marker-home" });
var museumIcon = new MyIconSprite({ className: "mysprite-marker-museum" });
```

CSS:
```css
.mysprite-marker-home, .mysprite-marker-museum {
  background: url(dist/images/my-icon-sprite.png) no-repeat;
}
.mysprite-marker-museum {
  background-position: 0 0;
}
.mysprite-marker-home {
  background-position: -32px 0;
}
```

What about shadows? If yoy need a shadow, add ```shadow: true``` to ```MyIconSprite``` options and another css rule that sets the background of the shadow div.

Example:

CSS:
```css
.leaflet-shadow-pane .mysprite-marker-home, .leaflet-shadow-pane .mysprite-marker-museum {
  background: url(dist/images/shadow.png) no-repeat;
}
```

JavaScript:
```js
var MyIconSprite = L.DivIcon.extend({
  options: {
    iconSize: new L.Point(32,37),
    iconAnchor: new L.Point(16,35),
    shadow: true
  }
});
var homeIcon = new MyIconSprite({ className: "mysprite-marker-home" });
var museumIcon = new MyIconSprite({ className: "mysprite-marker-museum" });
```

You can still load single images in the following way.

JavaScript:
```js
var MyIcon = L.Icon.extend({
  options: {
    iconUrl: 'dist/images/my-custom-marker.png',
    shadowUrl: 'dist/images/my-custom-shadow.png',
    iconSize: new L.Point(25, 41),
    iconAnchor: new L.Point(13, 41),
    popupAnchor: new L.Point(0, -33),
    shadowSize: new L.Point(41, 41)
  }
});
var myIcon = new MyIcon();
```

## Better popups
This fork provides also better, more modern popups. The ```Popup``` class was extended with an autoexplicative ```autoCenter``` parameter.

Example:

<img src="http://dl.dropbox.com/u/87268031/leaflet-popup-example.png" alt="" />

CSS:
```css
.leaflet-popup-image,
.leaflet-popup-text {
  display: table-cell;
  }
.leaflet-popup-image {
  line-height: 1px;
  padding-right: 10px;
  }
.leaflet-popup-text {
  width: 100%;
  vertical-align: top;
  font-size: 11px;
  }
.leaflet-popup-p-title {
  margin: 0 0 2px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  line-height: 16px;
  font-size: 12px;
  }
.leaflet-popup-p-content {
  margin: 0;
  color: #666;
  }
.leaflet-popup-p-details {
  margin: 0;
  height: 15px;
  line-height: 15px;
  }
.leaflet-popup-detail {
  display: inline-block;
  margin-right: 12px;
  text-align: center;
  }
```

JavaScript:
```js
L.Popup.mergeOptions({
  minWidth: 270,
  maxWidth: 270,
  autoCenter: true,
  closeButton: false
});
var my_popup = '<div class="leaflet-popup-image"><img src="image.jpg"/></div>' +
               '<div class="leaflet-popup-text">' +
                 '<p class="leaflet-popup-p-title"><a href="#">ARCHITEKTUR!</a></p>' +
                 '<p class="leaflet-popup-p-content">MAXXI Museo nazionale delle arti</p>' +
                 '<p class="leaflet-popup-p-details">' +
                   '<span class="leaflet-popup-detail"><i class="icon-calendar"></i> 04-07-2012</span>' +
                   '<span class="leaflet-popup-detail"><i class="icon-time"></i> 20.00 pm</span>' +
                   '<span class="leaflet-popup-detail"><i class="icon-user"></i> <a href="#">122</a></span>' +
                 '</p>' +
               '</div>';
var my_marker = new L.Marker(new L.LatLng(41.929645, 12.467015), { icon: museumIcon }).bindPopup(my_popup);
```


## IE6 Notes
As many of you know, Internet Explorer 6 doesn't support alpha transparency. The ```filter``` hack doesn't work for icon sprites, 'cause the browser ignores ```background-position``` property.
Anyway, it seems to be buggy on the master branch of Leaflet too, so it **works without transparency**.
