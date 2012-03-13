# ABOUT

cockpit.js lets you add an retro-style 2D cockpit overlay to your 3D game and
lets you move it around, vibrate and shake it to simulate the player's head
movement and/or physical impact on the ship/car/plane/vehicle.

The idea is strikingly simple and has worked for years in simulators (and is
still being used today in games). I figured that the implementation would be
strikingly simple as well and gave it a shot on a sunday night. But, I like it,
and plan to add more features to it without increasing it's low complexity.

# Usage

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



# TODO

* Use transform3d() instead of left/right and compare performance
* Add beginShake() and endShake() methods to do ongoing shaking
* Add methods to conveniently add HUD like text to the cockpit
* Add preventMove param to vibrate and shake to enable more precise movements
* Change shake and vibrate signature to kwArgs to not screw up existing code
when new params are introduced
* Add z-axis movement, might look nice for intense de-/acceleration
* Add UMD wrapper
