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
    default:
      const _exhaust: never = side
      return _exhaust
  }
}

function* generateMove(): Generator<Move, never, never> {
  let lastMove: Move = {
    side: "F",
    axis: sideAxis("F"),
    count: 1
  }

  const sides: Side[] = ['F', 'B', 'L', 'R', 'U', 'D']

  while (true) {
    let availableSides = sides.filter(side => {
      console.log(side, sideAxis(side));
      return sideAxis(side) != sideAxis(lastMove.side)
    })
    const randomSide = availableSides[Math.floor(Math.random() * availableSides.length)]
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
  const generator = generateMove();
  return Array.from(Array(count), () => generator.next(), generator) // generator.next() is called `count` times
    .map(o => moveToString(o.value)) // convert values to move string
    .join(" ")
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <p id="scramble"></p>
  <button id="button" onclick="replace()">Generate Another!</button>
`

let scramble = document.querySelector<HTMLParagraphElement>('#scramble')!
let button = document.querySelector<HTMLButtonElement>('#button')!

function reset() {
  scramble.textContent = generateScramble(20);
}
button.onclick = reset;

reset()