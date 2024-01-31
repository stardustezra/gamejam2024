import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;
const MAX_JUMPS = 2;

kaboom();

loadSprite("wizard", "sprites/wizard.png");
loadSprite("batman", "sprites/batman.png");
setBackground(0, 0, 0);

scene("game", () => {
  setGravity(1600);

  const player = add([
    sprite("wizard"),
    pos(80, 40),
    area(),
    body(),
    {
      jumpCount: 0,
    },
  ]);

  const enemy = add([
    sprite("batman"),
    pos(width() - 80, height() - FLOOR_HEIGHT),
    area(),
    body(),
  ]);

  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    anchor("botleft"),
    area(),
    body({ isStatic: true }),
    color(255, 255, 255),
  ]);

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      player.jumpCount = 0; // Reset jump count on the ground
    } else if (player.jumpCount < MAX_JUMPS) {
      player.jump(JUMP_FORCE);
      player.jumpCount++;
    }
  }

  onKeyPress("space", jump);
  onClick(jump);

  function spawnTree() {
    add([
      rect(48, rand(32, 96)),
      area(),
      outline(4),
      pos(width(), height() - FLOOR_HEIGHT),
      anchor("botleft"),
      color(255, 255, 255),
      move(LEFT, SPEED),
      "tree",
    ]);

    wait(rand(0.5, 1.5), spawnTree);
  }

  spawnTree();

  player.onCollide("tree", () => {
    go("lose", score);
  });

  player.onCollide("enemy", () => {
    go("lose", score);
  });

  let score = 0;

  const scoreLabel = add([text(score), pos(24, 24)]);

  onUpdate(() => {
    score++;
    scoreLabel.text = score;

    // Move the enemy towards the player
    const direction = player.pos.sub(enemy.pos).unit();
    enemy.move(direction.scale(SPEED));
  });
});

scene("lose", (score) => {
  add([
    sprite("wizard"),
    pos(width() / 2, height() / 2 - 80),
    scale(2),
    anchor("center"),
  ]);

  add([
    text(score),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    anchor("center"),
  ]);

  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

go("game");
