import k from './kaplay.js'

k.loadSprite("spritesheet", "./assets/sprites/spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
      "idle-down": 936 + 16,
      "walk-down": { from: 936 + 16, to: 939 + 16, loop: true, speed: 8 },
      "idle-side": 975 + 16,
      "walk-side": { from: 975 + 16, to: 978 + 16, loop: true, speed: 8 },
      "idle-up": 1014 + 16,
      "walk-up": { from: 1014 + 16, to: 1017 + 16, loop: true, speed: 8 },
    },
  });

k.loadSprite('map', './assets/sprites/map.png')