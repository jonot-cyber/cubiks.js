enum Axis {
	X = 0,
	Y = 1,
	Z = 2,
}

type Sides = ["F", "B", "U", "D", "L", "R"];
type Side = Sides[number];

interface Move {
	side: Side;
	axis: Axis;
	count: number;
}

function moveToString(move: Move): string {
	let res = move.side;
	switch (move.count) {
		case 2:
			res += "2";
			break;
		case 3:
			res += "'";
			break;
	}
	return res;
}

function sideAxis(side: Side): Axis {
	switch (side) {
		case "L":
		case "R":
			return Axis.X;
		case "U":
		case "D":
			return Axis.Y;
		case "F":
		case "B":
			return Axis.Z;
		default:
			const _exhaust: never = side;
			return _exhaust;
	}
}

function* generateMove(): Generator<Move, never, never> {
	let lastMove: Move | undefined;

	const sides: Sides = ["F", "B", "U", "D", "L", "R"];

	while (true) {
		let availableSides = sides.filter((side) => {
			console.log(side, sideAxis(side));
			if (!lastMove) return true;
			return sideAxis(side) != sideAxis(lastMove.side);
		});
		const randomSide =
			availableSides[Math.floor(Math.random() * availableSides.length)];
		let move: Move = {
			side: randomSide,
			axis: sideAxis(randomSide),
			count: Math.floor(Math.random() * 3) + 1,
		};
		lastMove = move;
		yield move;
	}
}

function generateScramble(count: number): string {
	const generator = generateMove();
	return Array.from(Array(count), () => generator.next(), generator) // generator.next() is called `count` times
		.map((o) => moveToString(o.value)) // convert values to move string
		.join(" ");
}

const scramble = document.querySelector<HTMLParagraphElement>("#scramble")!;
const button = document.querySelector<HTMLButtonElement>("#button")!;

function reset() {
	scramble.textContent = generateScramble(20);
}

button.addEventListener("click", reset);

reset();
