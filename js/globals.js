const WIDTH = 10;
const HEIGHT = 20;
const BLOCK_SIZE = 30;

const level_id = document.getElementById('level');
const lines_id = document.getElementById('lines');
const score_id = document.getElementById('score');
const ctx = document.getElementById('main-basket').getContext('2d');
const ctx2 = document.getElementById('side-basket').getContext('2d');

const LEVELSCORE = [300, 500, 1000, 2000, 3000, 4000, 5000, 7000, 10000];

const KEY = {
  SPACE: ' ',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
};

let timer = {main: 0, line: 0, touched: 0, touchedMAX: 15, max: 60};
let combo = 0;
let touchedMaxModCond = false;
let isGameOver = false;

function copyArray(arr) {
  let copy = [];
  for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
          copy[i] = copyArray(arr[i]);
      } else {
          copy[i] = arr[i];
      }
  }
  return copy;
}