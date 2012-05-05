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

## About this fork
This fork provides css icon sprite by default. Loading images will require only one http request of 4kb instead of six http requests of about 11kb.
The ```DivIcon``` class was extended to support shadows (through the option ```shadow: true```, ```false``` by default).
Provided a css sprite, in order to instantiate a new set of icons in this way:
 ```
 // If you need to change image size or add shadow
 // This example uses sizes and anchor points for
 // Nicolas Mollet's map icons collection,
 // tiled horizontally
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
 ```
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
You can still load single images in the following way:
 ```
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

## IE6 Notes
As many of you know, Internet Explorer 6 doesn't support alpha transparency. The ```filter``` hack doesn't work for icon sprites, 'cause the browser ignores ```background-position``` property.
Anyway, it seems to be buggy on the master branch of Leaflet too, so it **works without transparency**.
