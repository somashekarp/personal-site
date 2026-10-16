'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';

const links = [
	{ id: 'about', label: 'About' },
	{ id: 'projects', label: 'Projects' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'skills', label: 'Skills' },
];

export default function Header() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [active, setActive] = useState('');
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: .001 });

	useEffect(() => {
		const onScroll = () => setScrolled(scrollY > 10);
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });

		// Highlight the menu link of whichever section crosses the middle of the screen
		const observer = new IntersectionObserver((entries) => {
			for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
		}, { rootMargin: '-45% 0px -50% 0px' });
		document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));

		return () => {
			removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	}, []);

	return (
		<>
			<motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
			<header className={`top${scrolled ? ' scrolled' : ''}`}>
				<div className="wrap top-inner">
					<a className="logo" href="#top">{profile.logo}</a>
					<button className="menu-btn" type="button" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
						{open ? 'Close' : 'Menu'}
					</button>
					<nav className={`nav${open ? ' open' : ''}`} id="nav" aria-label="Primary" onClick={(e) => {
						if ((e.target as Element).closest('a')) setOpen(false);
					}}>
						{links.map((l) => (
							<a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : undefined} aria-current={active === l.id ? 'true' : undefined}>
								{l.label}
								{active === l.id && <motion.span className="nav-indicator" layoutId="nav-indicator" />}
							</a>
						))}
						<a className="btn btn-small" href="#contact">Hire me</a>
					</nav>
				</div>
			</header>
		</>
	);
}
