import './style.css'

enum Axis {
  X = 0,
  Y = 1,
  Z = 2
}

type Side = "F" | "B" | "U" | "D" | "L" | "R";

interface Move {
  side: Side,
  axis: Axis,
  count: number,
}

function moveToString(move: Move): string {
  let res = move.side;
  switch (move.count) {
    case 2:
      res += '2';
      break;
    case 3:
      res += '\'';
      break;
  }
  return res;
}

function sideAxis(side: Side): Axis {
  switch (side) {
    case 'L':
    case 'R':
      return Axis.X;
    case 'U':
    case 'D':
      return Axis.Y;
    case 'F':
    case 'B':
      return Axis.Z;

  }
}

function* generateMove(): Generator<Move, null, null> {
  let lastMove: Move = {
    side: "F",
    axis: sideAxis("F"),
    count: 1
  }

  const sides: Array<Side> = ['F', 'B', 'L', 'R', 'U', 'D']

  while (true) {
    let availableSides: Array<Side> = sides.filter(side => {
      console.log(side, sideAxis(side));
      return sideAxis(side) != sideAxis(lastMove.side)
    })
    const randomSide: Side = availableSides[Math.floor(Math.random() * availableSides.length)]
    let move: Move = {
      side: randomSide,
      axis: sideAxis(randomSide),
      count: Math.floor(Math.random() * 3) + 1
    }
    lastMove = move
    yield move
  }
}

function generateScramble(count: number): string {
  let res = "";
  let generator = generateMove();
  for (let i = 0; i < count; i++) {
    res += " " + moveToString(generator.next().value!)
  }
  return res
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <p id="scramble"></p>
  <button id="button" onclick="replace()">Generate Another!</button>
`

let scramble: HTMLParagraphElement = document.querySelector<HTMLParagraphElement>('#scramble')!
let button: HTMLButtonElement = document.querySelector<HTMLButtonElement>('#button')!

function reset() {
  scramble.textContent = generateScramble(20);
}
button.onclick = reset;

reset()