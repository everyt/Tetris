let basket = new Basket(ctx, WIDTH, HEIGHT);
let display = new Display(ctx2, 5, 3);
basket.display = display;
let block = new Block(basket.nextBlockType);
basket.block = block;
let textController = new TextController(level_id, lines_id, score_id);
basket.textController = textController;

const keyFunction = {
  [KEY.SPACE]: (p) => ({...p, y: p.y + 1}),
  [KEY.DOWN]: (p) => ({...p, y: p.y + 1}),
  [KEY.LEFT]: (p) => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: (p) => ({...p, x: p.x + 1}),
  [KEY.UP]: (p) => (basket.turnBlock(p))
};

(() => {
  window.removeEventListener("keydown", onKeydownEvent);
  window.addEventListener("keydown", onKeydownEvent);
  basket.placeBlock();
  repeater();
})();

function onKeydownEvent(event) {
  if (keyFunction[event.key]) {
    if (touchedMaxModCond && timer.touchedMAX < 30) {
      timer.touchedMAX += 5;
    }
    let dest = keyFunction[event.key](block.loc);
    basket.moveBlock(dest);
    if (event.key === KEY.SPACE) {
      while (true) {
        dest = keyFunction[event.key](block.loc);
        basket.moveBlock(dest);
        if (basket.isTouched(dest)) {
          break;
        }
      }
    }
  }
}

function repeater() {{
  timer.main++;
  timer.line++;
  let dest = keyFunction[KEY.DOWN](block.loc);
  if (timer.line > 5) {
    timer.line = 0;
    basket.lineManager();
  }
  if (basket.isTouched(dest)) {
    touchedMaxModCond = true;
    timer.touched++;
  }
  if (timer.touched >= timer.touchedMAX) {
    touchedMaxModCond = false;
    timer.touched = 0;
    timer.touchedMAX = 15;
    if (basket.checkGameOver()) {
      GameOver();
    }
    basket.getNewBlock();
  }
  if (timer.main > timer.max && isGameOver == false) {
    timer.main = 0;
    combo = 0;
    basket.moveBlock(dest);
  }
  requestAnimationFrame(repeater);
}}

function GameOver() {
  isGameOver = true;
  basket.init();
  textController.init();
  isGameOver = false;
}