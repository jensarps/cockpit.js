# ABOUT

cockpit.js lets you add an retro-style 2D cockpit overlay to your 3D game and
lets you move it around, vibrate and shake it to simulate the player's head
movement and/or physical impact on the ship/car/plane/vehicle.

The idea is strikingly simple and has worked for years in simulators (and is
still being used today in games). I figured that the implementation would be
strikingly simple as well and gave it a shot on a sunday night. But, I like it,
and plan to add more features to it without increasing it's low complexity.

# Usage

Grab the cockpit.js file and include it in your page.

To add a cockpit to your game, just create a new Cockpit instance and pass the
path to the cockpit overlay image:

`var cockpit = new Cockpit('path/to/my/overlay.png');`

The most basic thing to do now is to move your cockpit around:

`cockpit.move(horizontalValue, verticalValue);`

The two values you have to pass must be numbers ranging from 0 to 1, where 1 is  the maximum movement.

Next, make your cockpit vibrate for a set duration:

`cockpit.vibrate(duration);`

Duration is passed in ms and optional, defaulting to 600ms.

If you don't now upfront how long your cockpit is going to vibrate, use the following two methods:

`cockpit.beginVibrate();` and `cockpit.endVibrate();`

If things go hairy, e.g. your vehicle is being hit, you can shake your cockpit:

`cockpit.shake(intensity, duration);`

Where intensity is a number from 0 to 1. Duration is passed in ms. Both arguments are optional, intensity defaulting to 0.5 and duration to 300.

As with vibrating, you can shake the cockpit for an unkown amout of time using

`cockpit.beginShake(intensity);` and `cockpit.endShake();`

The intensity param is optional and works as described above.

Instead of the begin/end methods, you can also use the following method:

`cockpit.setState(state);`

where state is one of 'normal', 'vibrate' or 'shake'. You can't pass any options for now (it will use default values), but you have a convenient method to toggle between the different states.

You can also add some HUD-like text items to your cockpit, that will move around with the cockpit:

`cockpit.addText(id, textToDisplay);`

The id is applied to the text item's DOMNode, so you can use it to position and style it. For positioning, I recommend to use absolute positioning with percentages so that the text will stay in place independent of window size (well, almost, soo TODO section).

To update your text item, just call

`cockpit.updateText(id, textToDisplay);`

with the id you previously passed and the new text.


# Demos

* [Using cockpit.js over a three.js example.](http://jensarps.github.com/cockpit.js/demo/three) When you get too close to the earth's atmosphere, the ship will start to vibrate and lose speed. Observe the HUD to see your current thrust, speed and g-force.
* [A cockpit over a white background.](http://jensarps.github.com/cockpit.js/demo/plain) Yeah. Just for a quick test. Doubleclick to shake, right click to vibrate.


# TODO

* ~~Use transform3d() instead of left/right and compare performance~~
* ~~Add beginShake() and endShake() methods to do ongoing shaking~~
* ~~Add methods to conveniently add HUD like text to the cockpit~~
* Add methods to allow grouping of text items
* Handle positioning of text inside of the code to make it precisely show up at the desired spot
* Add preventMove param to vibrate and shake to enable more precise movements
* Change shake and vibrate signature to kwArgs to not screw up existing code
when new params are introduced
* Add z-axis movement, might look nice for intense de-/acceleration
* ~~Add UMD wrapper~~
