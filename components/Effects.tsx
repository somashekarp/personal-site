'use client';

import { useEffect } from 'react';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Mouse and scroll touches that work directly on the DOM: the grid flashlight,
// tile spotlights ([data-spot]), the experience line, and tilt ([data-tilt]) /
// magnetic ([data-magnetic]) hover. Renders nothing.
export default function Effects() {
	useEffect(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const finePointer = matchMedia('(pointer: fine)').matches && !reduce;
		const pointer = { x: 0, y: 0, active: false };
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
				const deg = 7 * Math.min(1, 420 / r.width);   // big tiles tilt less, so their far edge doesn't swing
				tilt.style.transform = `perspective(1200px) rotateY(${x * deg}deg) rotateX(${-y * deg}deg)`;
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

		let raf = 0;

		function frame() {
			const vh = innerHeight;
			const grid = document.querySelector<HTMLElement>('.grid-glow');
			const spots = [...document.querySelectorAll<HTMLElement>('[data-spot]')];
			const timeline = document.querySelector<HTMLElement>('.timeline');
			const jobs = timeline ? [...timeline.children] as HTMLElement[] : [];

			// Read layout first, then write, so each frame lays out once.
			const spotBoxes = spots.map((el) => el.getBoundingClientRect());
			const lineBox = timeline?.getBoundingClientRect();
			const jobTops = jobs.map((li) => li.getBoundingClientRect().top);

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
