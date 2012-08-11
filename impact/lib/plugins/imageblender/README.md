Info
----
Tint your images in ImpactJS on the client side. Uses the 'multiply' blending mode to colourize each pixel.

![example](/deakster/impact-imageblender/raw/master/example.png)

(example sprite from http://opengameart.org/content/zombies-skeletons)

Usage
-----

- Copy imageblender.js into your lib/game folder
- In your game's module, add an entry to the require section for the module 'game.imageblender'
- Append *#hexcolor* to the path in any ig.Image or ig.AnimationSheet. For example, rather than
loading 'media/monster.png' you can change it to 'media/monster.png#FF0000' to tint it red.

For more info [see this forum post](http://impactjs.com/forums/code/image-blender-tint-blend-your-images-client-side-using-any-color)