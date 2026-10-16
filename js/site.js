const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// Frame-rate independent easing, so 60Hz and 120Hz screens feel the same.
const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.pow(1 - k, dt * 60));

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches && !reduce;

const pointer = { x: 0, y: 0, active: false };
addEventListener('pointermove', (e) => {
	pointer.x = e.clientX;
	pointer.y = e.clientY;
	pointer.active = true;
}, { passive: true });

/* Mobile menu */
const menuBtn = $('.menu-btn');
const nav = $('.nav');
function setMenu(open) {
	nav.classList.toggle('open', open);
	menuBtn.setAttribute('aria-expanded', open);
	menuBtn.textContent = open ? 'Close' : 'Menu';
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* Header background once you scroll */
const header = $('.top');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Highlight the menu link of the section on screen */
const links = new Map($$('.nav a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
const sectionObserver = new IntersectionObserver((entries) => {
	for (const e of entries) {
		if (!e.isIntersecting) continue;
		links.forEach((a) => a.classList.remove('active'));
		links.get(e.target.id)?.classList.add('active');
	}
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => sectionObserver.observe(s));

/* Fade cards in as they scroll into view, staggered within a group */
const revealObserver = new IntersectionObserver((entries) => {
	for (const e of entries) {
		if (!e.isIntersecting) continue;
		e.target.classList.add('in');
		revealObserver.unobserve(e.target);
	}
}, { threshold: .12 });
$$('.reveal').forEach((el) => {
	const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
	el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
	revealObserver.observe(el);
});

/* Project waveforms, drawn once */
const waves = {
	rise: (x) => Math.sin(x * .02) * 45 + x * .05 - 30,
	ecg: (x) => {
		const m = x % 240;
		if (m > 96 && m < 108) return 80;
		if (m >= 108 && m < 122) return -55;
		if (m > 150 && m < 186) return Math.sin((m - 150) / 36 * Math.PI) * 18;
		return 0;
	},
	square: (x) => (Math.floor(x / 90) % 2 ? -38 : 38),
	steps: (x) => Math.floor(x / 150) * 22 - 78,
	bounce: (x) => Math.abs(Math.sin(x * .012)) * 80 - 40,
	skyline: (x) => [30, 70, 45, 90, 55, 75, 35, 60, 85, 40, 65, 50, 80, 30, 70, 45, 90, 55][Math.floor(x / 70) % 18] - 50,
	market: (x) => Math.sin(x * .013) * 30 + Math.sin(x * .047) * 14 + Math.sin(x * .11) * 7 + x * .02 - 12,
	ledger: (x) => ((x % 200) / 200) * 90 - 45,
	zigzag: (x) => (Math.abs((x % 120) - 60) - 30) * 1.6,
	sprout: (x) => Math.sin(x * .025) * (8 + x * .05),
};
$$('.trace').forEach((svg) => {
	const f = waves[svg.dataset.trace];
	let d = '';
	for (let x = 0; x <= 1200; x += 3) d += `${x ? 'L' : 'M'}${x} ${(100 - f(x)).toFixed(1)}`;
	svg.querySelector('path').setAttribute('d', d);
});

/* Buttons lean toward the mouse, cards tilt under it */
if (finePointer) {
	$$('[data-magnetic]').forEach((el) => {
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
		});
		el.addEventListener('pointerleave', () => { el.style.transform = ''; });
	});

	$$('[data-tilt]').forEach((el) => {
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - .5;
			const y = (e.clientY - r.top) / r.height - .5;
			el.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
		});
		el.addEventListener('pointerleave', () => { el.style.transform = ''; });
	});
}

/* One loop: mouse-following gradients, timeline fill, progress bar */
const hero = $('.hero');
const glow = { x: innerWidth * .7, y: innerHeight * .4, x2: innerWidth * .6, y2: innerHeight * .7 };
const spots = $$('[data-spot]');
const timeline = $('.timeline');
const jobs = [...timeline.children];
const bar = $('.progress');
const gridGlow = $('.grid-glow');
let last = performance.now();

function frame(now) {
	const dt = Math.min((now - last) / 1000, .1);
	last = now;
	const vh = innerHeight;

	// Read layout first, then write, so each frame lays out once.
	const heroBox = hero.getBoundingClientRect();
	const spotBoxes = spots.map((el) => el.getBoundingClientRect());
	const lineBox = timeline.getBoundingClientRect();
	const jobTops = jobs.map((li) => li.getBoundingClientRect().top);
	const maxScroll = document.documentElement.scrollHeight - vh;

	if (heroBox.bottom > 0 && !reduce) {
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
		gridGlow.style.setProperty('--mx', `${pointer.x}px`);
		gridGlow.style.setProperty('--my', `${pointer.y}px`);
		spotBoxes.forEach((b, i) => {
			if (b.bottom < 0 || b.top > vh) return;
			spots[i].style.setProperty('--sx', `${(pointer.x - b.left).toFixed(1)}px`);
			spots[i].style.setProperty('--sy', `${(pointer.y - b.top).toFixed(1)}px`);
		});
	}

	const mark = vh * .6;
	timeline.style.setProperty('--fill', clamp((mark - lineBox.top) / lineBox.height, 0, 1).toFixed(3));
	jobs.forEach((li, i) => li.classList.toggle('lit', jobTops[i] + 30 < mark));

	bar.style.transform = `scaleX(${maxScroll > 0 ? scrollY / maxScroll : 0})`;

	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
