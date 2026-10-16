'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';
import HeroSphere from './HeroSphere';
import { ease } from './ui';

// One staggered entrance on page load
const enter = (i: number) => ({
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: .8, ease, delay: .1 + i * .1 },
});

export default function Hero() {
	const reduce = useReducedMotion();
	const [word, setWord] = useState(0);

	useEffect(() => {
		if (reduce) return;
		const timer = setInterval(() => setWord((w) => (w + 1) % profile.roleWords.length), 2600);
		return () => clearInterval(timer);
	}, [reduce]);

	return (
		<section className="hero" id="top">
			<HeroSphere />
			<div className="wrap hero-content">
				<motion.p className="hello" {...enter(0)}>Hi, I&apos;m</motion.p>
				<motion.h1 className="name" data-spot {...enter(1)}>{profile.name}</motion.h1>
				<motion.p className="role" {...enter(2)}>
					<span className="sr">{profile.roleSentence}</span>
					<span aria-hidden="true">
						Full-stack developer building{' '}
						<span className="rotator">
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={profile.roleWords[word]}
									initial={{ y: '80%', opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: '-80%', opacity: 0 }}
									transition={{ duration: .35, ease }}
								>
									{profile.roleWords[word]}
								</motion.span>
							</AnimatePresence>
						</span>
					</span>
				</motion.p>
				<motion.p className="role-sub" {...enter(3)}>{profile.intro}</motion.p>
				<motion.div className="actions" {...enter(4)}>
					<a className="btn btn-primary" href="#projects" data-magnetic>View my work</a>
					<a className="btn btn-ghost" href="#contact" data-magnetic>Get in touch</a>
				</motion.div>
				<motion.ul className="social" {...enter(5)}>
					<li><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
					<li><a href={profile.github} target="_blank" rel="noopener">GitHub</a></li>
					<li><a href={profile.whatsapp} target="_blank" rel="noopener">WhatsApp</a></li>
				</motion.ul>
			</div>
			<p className="hint">
				<span className="hint-fine">Move your cursor over the sphere, or click to send a pulse.</span>
				<span className="hint-touch">Tap the sphere to send a pulse.</span>
			</p>
		</section>
	);
}
