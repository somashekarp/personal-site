// Waveform drawn on each project card, picked to suit the project.
// Each returns a height (-100..100) for x in 0..1200.

const skyline = [30, 70, 45, 90, 55, 75, 35, 60, 85, 40, 65, 50, 80, 30, 70, 45, 90, 55];

const waves = {
	rise: (x: number) => Math.sin(x * .02) * 45 + x * .05 - 30,
	ecg: (x: number) => {
		const m = x % 240;
		if (m > 96 && m < 108) return 80;
		if (m >= 108 && m < 122) return -55;
		if (m > 150 && m < 186) return Math.sin((m - 150) / 36 * Math.PI) * 18;
		return 0;
	},
	square: (x: number) => (Math.floor(x / 90) % 2 ? -38 : 38),
	steps: (x: number) => Math.floor(x / 150) * 22 - 78,
	bounce: (x: number) => Math.abs(Math.sin(x * .012)) * 80 - 40,
	skyline: (x: number) => skyline[Math.floor(x / 70) % skyline.length] - 50,
	market: (x: number) => Math.sin(x * .013) * 30 + Math.sin(x * .047) * 14 + Math.sin(x * .11) * 7 + x * .02 - 12,
	ledger: (x: number) => ((x % 200) / 200) * 90 - 45,
	zigzag: (x: number) => (Math.abs((x % 120) - 60) - 30) * 1.6,
	sprout: (x: number) => Math.sin(x * .025) * (8 + x * .05),
};

export type TraceName = keyof typeof waves;

export function tracePath(name: TraceName) {
	const f = waves[name];
	let d = '';
	for (let x = 0; x <= 1200; x += 3) d += `${x ? 'L' : 'M'}${x} ${(100 - f(x)).toFixed(1)}`;
	return d;
}
