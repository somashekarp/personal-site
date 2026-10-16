'use client';

import { useEffect } from 'react';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
// Frame-rate independent easing, so 60Hz and 120Hz screens feel the same.
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.pow(1 - k, dt * 60));

// Mouse and scroll touches that work directly on the DOM: the hero glow, the
// grid flashlight, card spotlights ([data-spot]), the experience line, and
// tilt ([data-tilt]) / magnetic ([data-magnetic]) hover. Renders nothing.
export default function Effects() {
	useEffect(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const finePointer = matchMedia('(pointer: fine)').matches && !reduce;
		const pointer = { x: 0, y: 0, active: false };
		const glow = { x: innerWidth * .7, y: innerHeight * .4, x2: innerWidth * .6, y2: innerHeight * .7 };
		let tilted: HTMLElement | null = null;
		let pulled: HTMLElement | null = null;

		function onMove(e: PointerEvent) {
			pointer.x = e.clientX;
			pointer.y = e.clientY;
			pointer.active = true;
			if (!finePointer || !(e.target instanceof Element)) return;

			const tilt = e.target.closest<HTMLElement>('[data-tilt]');
			if (tilted && tilted !== tilt) tilted.style.transform = '';
			tilted = tilt;
			if (tilt) {
				const r = tilt.getBoundingClientRect();
				const x = (e.clientX - r.left) / r.width - .5;
				const y = (e.clientY - r.top) / r.height - .5;
				tilt.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
			}

			const magnet = e.target.closest<HTMLElement>('[data-magnetic]');
			if (pulled && pulled !== magnet) pulled.style.transform = '';
			pulled = magnet;
			if (magnet) {
				const r = magnet.getBoundingClientRect();
				magnet.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
			}
		}

		function onLeave() {
			if (tilted) tilted.style.transform = '';
			if (pulled) pulled.style.transform = '';
			tilted = pulled = null;
		}

		addEventListener('pointermove', onMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onLeave);

		let last = performance.now();
		let raf = 0;

		function frame(now: number) {
			const dt = Math.min((now - last) / 1000, .1);
			last = now;
			const vh = innerHeight;
			const hero = document.querySelector<HTMLElement>('.hero');
			const grid = document.querySelector<HTMLElement>('.grid-glow');
			const spots = [...document.querySelectorAll<HTMLElement>('[data-spot]')];
			const timeline = document.querySelector<HTMLElement>('.timeline');
			const jobs = timeline ? [...timeline.children] as HTMLElement[] : [];

			// Read layout first, then write, so each frame lays out once.
			const heroBox = hero?.getBoundingClientRect();
			const spotBoxes = spots.map((el) => el.getBoundingClientRect());
			const lineBox = timeline?.getBoundingClientRect();
			const jobTops = jobs.map((li) => li.getBoundingClientRect().top);

			if (hero && heroBox && heroBox.bottom > 0 && !reduce) {
				// Follow the mouse only while it's over the hero, so the glow never gets cut off at its edge
				const inHero = pointer.active && pointer.y < heroBox.bottom - 100;
				const tx = inHero ? pointer.x - heroBox.left : heroBox.width * .7;
				const ty = inHero ? pointer.y - heroBox.top : heroBox.height * .4;
				glow.x = damp(glow.x, tx, .08, dt);
				glow.y = damp(glow.y, ty, .08, dt);
				glow.x2 = damp(glow.x2, tx, .03, dt);
				glow.y2 = damp(glow.y2, ty, .03, dt);
				hero.style.setProperty('--gx', `${glow.x.toFixed(1)}px`);
				hero.style.setProperty('--gy', `${glow.y.toFixed(1)}px`);
				hero.style.setProperty('--gx2', `${glow.x2.toFixed(1)}px`);
				hero.style.setProperty('--gy2', `${glow.y2.toFixed(1)}px`);
			}

			if (pointer.active) {
				grid?.style.setProperty('--mx', `${pointer.x}px`);
				grid?.style.setProperty('--my', `${pointer.y}px`);
				spotBoxes.forEach((b, i) => {
					if (b.bottom < 0 || b.top > vh) return;
					spots[i].style.setProperty('--sx', `${(pointer.x - b.left).toFixed(1)}px`);
					spots[i].style.setProperty('--sy', `${(pointer.y - b.top).toFixed(1)}px`);
				});
			}

			if (timeline && lineBox) {
				const mark = vh * .6;
				timeline.style.setProperty('--fill', clamp((mark - lineBox.top) / lineBox.height, 0, 1).toFixed(3));
				jobs.forEach((li, i) => li.classList.toggle('lit', jobTops[i] + 30 < mark));
			}

			raf = requestAnimationFrame(frame);
		}
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('pointermove', onMove);
			document.documentElement.removeEventListener('pointerleave', onLeave);
		};
	}, []);

	return null;
}
