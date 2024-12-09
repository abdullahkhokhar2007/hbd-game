import k from "../kaplay.js";
import { displayDialogue } from "../utils.js";

const name = "Hiba"

const container = document.querySelector('.fireworks')
const fireworks = new Fireworks.default(container)

const dialogueData = {
  playerbed: "Can't sleep right now. It's morning.",
  npcbed: "Can't sleep over here. It's Abdullah's bed.",
  door: 'The door is locked.',
  letter: `Letter:<br> It's Abdullah. I am very sorry ${name} that I am not able to celebrate your birthday with you due to a very important meeting I have. But, I have a present for you. I locked it in the chest but I forgot where I put the key in hurry. You have to find it yourself. Good luck!`
}

async function game() {
  k.setBackground(k.Color.fromHex("#311047"));
  const mapData = await (await fetch("./assets/sprites/map.json")).json();
  const layers = mapData.layers;
  const map = k.add([k.sprite("map"), k.scale(4), k.pos(0)]);
  const player = k.make([
    k.sprite("spritesheet", { anim: "idle-side" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.scale(4),
    k.pos(0),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
      hasKey: false
    },
    "player",
  ]);
  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);
        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            if (boundary.name === 'chest') {
              player.hasKey ? (fireworks.start(), container.style.display = 'block') : null
              displayDialogue(player.hasKey ? `The chest is opened. It has note inside it. It says:<br>Dear ${name}, I wish you a very happy birthday. May you live long. Here is your present.<br> <img id='snowglobe' src='./assets/sprites/Snow%20Globe.gif'>` : "The chest is locked.", () => (player.isInDialogue = false))
              return
            }
            if (boundary.name === 'tree') {
              displayDialogue(player.hasKey ? 'Nothing.' : 'You found a key inside the pot.', () => (player.isInDialogue = false));
              player.hasKey ? null : player.hasKey = true
              return
            }
            displayDialogue(dialogueData[boundary.name], () => (player.isInDialogue = false));
          })
        }
      }
      continue;
    }
    console.log(layer);
    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * 4,
            (map.pos.y + entity.y) * 4
          );
          console.log(map.pos);
          console.log(player.pos);

          k.add(player);
          continue;
        }
      }
    }
  }
  k.onUpdate(() => {
    k.camPos(player.worldPos().x, player.worldPos().y - 100);
  });
  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== "walk-up"
    ) {
      player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== "walk-down"
    ) {
      player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }
  });
  function stopAnims() {
    if (player.direction === "down") {
      player.play("idle-down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle-up");
      return;
    }

    player.play("idle-side");
  }
  k.onMouseRelease(stopAnims);
}

export default game;
