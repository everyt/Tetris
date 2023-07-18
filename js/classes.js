class Basket {
  ctx;
  width;
  height;
  grid;
  nextBlockType;
  currBlockType;

  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.init();
  }

  init() {
    this.getEmptyGrid();
    this.getReadyDisplay();
    this.setGridFloor();
    this.updateDisplay();
    this.nextBlockType = this.getRandom(BLUEPRINTS_COUNT);
  }

  moveBlock(dest) {
    this.exception();
    if (this.canMove(dest)) {
      this.updateBlock(dest, false);
      this.block.loc = {x: dest.x, y: dest.y};
    }
    this.updateDisplay();
  }

  exception() {
    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].length > this.width) {
        this.grid[y].splice(this.width);
      }
    }
  }

  turnBlock(dest) {
    dest = {x: this.block.loc.x, y: this.block.loc.y};
    let destArr = copyArray(this.block.shape);
    for (let y = 0; y < destArr.length; y++) {
      for (let x = destArr.length - 1; x >= 0; x--) {
        this.block.shape[y][x] = destArr[x][y];
      }
      this.block.shape[y].reverse();
    }
    let orig = {x: dest.x, y: dest.y};
    dest = this.ifBesideWall(dest);
    if (this.canMove(dest)) {
      destArr.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.grid[orig.y + y][orig.x + x] = 0;
          }
        });
      });
      this.block.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.grid[dest.y + y][dest.x + x] = value;
          }
        });
      });
    } else {
      this.block.shape = copyArray(destArr);
    }
    return {x: dest.x, y: dest.y};
  }

  getNewBlock() {
    this.updateBlock(this.block.loc, true);
    this.placeBlock();
  }

  placeBlock() {
    this.setBlockProperties();
    this.display.updateNext(this.nextBlockType);
    if (this.canMove(this.block.loc) && isGameOver == false) {
      this.updateBlock(this.block.loc, false);
    } else {
      this.init();
    }
  }

  checkGameOver() {
    for (let y = 0; y < this.block.shape.length; y++) {
      console.log(this.block.loc.y + y);
      if (this.block.loc.y + y == 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  setBlockProperties() {
    this.placeDirection = this.getRandom(4);
    this.currBlockType = this.nextBlockType;
    this.nextBlockType = this.getRandom(BLUEPRINTS_COUNT);
    this.block.shape = this.getRotatedShape(this.currBlockType, this.placeDirection);
    let temp = this.block.shape[0].length / 2;
    let subtrahend = Math.floor(Math.random() * 2) == 0 ? Math.ceil(temp) : Math.floor(temp);
    this.block.loc = {x: Math.ceil(this.width / 2) - subtrahend, y: 0};
  }

  getRandom(Max) {
    return Math.floor(Math.random() * Max);
  }

  getRotatedShape(typeid, direction) {
    let copyShape = copyArray(BLUEPRINTS_SHAPES[typeid]);
    for (let i = 0; i < direction; i++) {
      for (let y = 0; y < copyShape.length; y++) {
        for (let x = copyShape.length - 1; x >= 0; x--) {
          BLUEPRINTS_SHAPES[typeid][y][x] = copyShape[x][y];
        }
        BLUEPRINTS_SHAPES[typeid][y].reverse();
      }
    }
    return BLUEPRINTS_SHAPES[typeid];
  }

  updateBlock(dest, die) {
    for (let i = 0; i < 2; i++) {
      this.block.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            if (i >= 1) {
                if (die) {
                  value += 7;
                }
                this.grid[dest.y + y][dest.x + x] = value;
            } else {
              this.grid[this.block.loc.y + y][this.block.loc.x + x] = 0;
            }
          }
        })
      })
    }
    this.updateDisplay();
  }

  isTouched(dest) {
    return !this.canMove(dest);
  }

  ifBesideWall(dest) {
    let resultX = dest.x;
    for (let y = 0; y < this.block.shape.length; y++) {
      for (let x = 0; x < this.block.shape[0].length; x++) {
        let dx = dest.x + x;
        if (dx >= this.width) {
          resultX = this.width - this.block.shape.length;
          break;
        } else if (dx < 0) {
          resultX = 0;
          break;
        }
      }
    }
    return {x: resultX, y: dest.y};
  }
  canMove(dest) {
    for (let y = 0; y < this.block.shape.length; y++) {
      for (let x = 0; x < this.block.shape[0].length; x++) {
        if (this.isBlock(this.block.shape, x, y)) {
          if ((this.isWall(dest.x + x)) || (!this.isBlanked(dest.x + x, dest.y + y))) {
            return false;
          }
        }
      }
    }
    return true;
  }

  isWall(x) {
    return x < 0 || x > this.width;
  }

  isBlock(arr, x, y) {
    return arr[y][x] > 0 && this.isBlanked(x, y);
  }

  isBlanked(x, y) {
    return this.grid[y][x] < 8 && typeof this.grid[y][x] !== 'undefined';
  }
  
  setGridFloor() {
    for (let i = 0; i < 3; i++) {
      this.grid[this.height + i] = Array(this.width).fill(15);
    }
  }

  getEmptyGrid() {
    this.grid = Array.from(
      {length : this.height},
      () => Array(this.width).fill(0)
    );

  }

  getReadyDisplay() {
    this.ctx.canvas.width = this.width * BLOCK_SIZE;
    this.ctx.canvas.height = this.height * BLOCK_SIZE;
  }

  updateDisplay() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        let color = value >= 8 ? value - 7 : value;
        this.ctx.fillStyle = BLUEPRINTS_COLORS[color];
        this.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        this.ctx.fillStyle = BLUEPRINTS_COLORS2[color];
        this.ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
      })
    })
  }

  lineManager() {
    for (let y = this.grid.length - 4; y >= 0; y--) {
      if (this.grid[y].every((value) => (value >= 8) ? true : false)) {
        this.grid[0].forEach((col, x) => {
          this.grid[y][x] = 0;
        })
        this.dropBlocks();
        this.updateDisplay();
        this.textManager();
      }
    }
  }

  dropBlocks() {
    for (let y = this.height - 2; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.isBlanked(x, y + 1) && this.grid[y][x] > 7) {
          this.grid[y + 1][x] = this.grid[y][x];
          this.grid[y][x] = 0;
        }
      }
    }
  }

  textManager() {
    combo++
    this.textController.addText(this.textController.lines, 1);
    this.textController.addText(this.textController.score, 100 * combo);
    this.levelManager();
  }

  levelManager() {
    for (let i = LEVELSCORE.length - 1; i >= 0; i--) {
      if (this.textController.score.value >= LEVELSCORE[i]) {
        this.textController.setText(this.textController.level, i+1);
        timer.max = 60 - (i + 2) * 5;
        break;
      }
    }
  }
}

class Display {
  
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.center = {
      x: 0,
      y: 0
    }
  }

  updateNext(typeid) {
    this.getReadyNext(typeid);
    NEXT_SHAPES[typeid].forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = BLUEPRINTS_COLORS[value];
          this.ctx.fillRect(this.x + x * BLOCK_SIZE, this.y + y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          this.ctx.fillStyle = BLUEPRINTS_COLORS2[value];
          this.ctx.fillRect(this.x + x * BLOCK_SIZE + 2, this.y + y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
        }
      })
    })
  }

  getReadyNext(typeid) {
    this.ctx.canvas.width = this.width * BLOCK_SIZE;
    this.ctx.canvas.height = this.height * BLOCK_SIZE;
    this.center.x = this.ctx.canvas.width / 2
    this.center.y = this.ctx.canvas.height / 2
    this.x = this.center.x - NEXT_SHAPES[typeid][0].length * BLOCK_SIZE / 2;
    let divisor = NEXT_SHAPES[typeid].length === 1 ? 2 : 1;
    this.y = this.center.y - BLOCK_SIZE / divisor;
  }

}

class Block {
  shape;

  constructor() {
    this.loc = {
      x: 0,
      y: 0
    }
  }
}

class TextController {
  score;
  level;
  lines;

  constructor(level, lines, score) {
    this.level = {id: level, value: 0};
    this.lines = {id: lines, value: 0};
    this.score = {id: score, value: 0};
  }
  
  init() {
    this.level.value = 0;
    this.lines.value = 0;
    this.score.value = 0;
    this.setText(this.level, this.level.value);
    this.setText(this.lines, this.lines.value);
    this.setText(this.score, this.score.value);
  }

  addText(text, int) {
    text.value += int;
    this.setText(text, text.value);
  }

  setText(text, value) {
    text.value = value;
    text.id.innerHTML = String(text.value);
  }
}