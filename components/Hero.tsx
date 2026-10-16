'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { experience, profile, projects } from '@/lib/data';
import HeroSphere from './HeroSphere';
import { CopyEmail, Tile, ease } from './ui';

const current = experience[0];

// The first screen: everything important about you, in tiles.
export default function Hero() {
	return (
		<section className="hero" id="top">
			<div className="wrap bento-hero">
				<Tile className="intro" style={{ gridArea: 'intro' }}>
					<div className="intro-text">
						<p className="hello">Hi, I&apos;m</p>
						<h1 className="name" data-spot>{profile.name}</h1>
						<RoleLine />
						<p className="role-sub">{profile.intro}</p>
						<div className="actions">
							<a className="btn btn-primary" href="#projects" data-magnetic>View my work</a>
							<a className="btn btn-ghost" href="#contact" data-magnetic>Get in touch</a>
						</div>
						<ul className="social">
							<li><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
							<li><a href={profile.github} target="_blank" rel="noopener">GitHub</a></li>
							<li><a href={profile.whatsapp} target="_blank" rel="noopener">WhatsApp</a></li>
						</ul>
					</div>
					{/* The photo fades into the card instead of sitting in its own box */}
					<div className="intro-photo">
						<Image src={profile.photo.src} width={profile.photo.width} height={profile.photo.height} alt={`Portrait of ${profile.name}`} priority />
						<span className="badge"><i aria-hidden="true" />{profile.availability}</span>
					</div>
				</Tile>

				<Tile className="sphere-tile" style={{ gridArea: 'sphere' }} delay={.12}>
					<HeroSphere />
					<p className="tile-caption">
						<span className="hint-fine">Move your cursor here, or click to send a pulse.</span>
						<span className="hint-touch">Tap here to send a pulse.</span>
					</p>
				</Tile>

				<Tile className="now" style={{ gridArea: 'now' }} delay={.16}>
					<p className="tile-label">Currently</p>
					<h2 className="tile-title">{current.role}</h2>
					<p className="accent">{current.company}</p>
					<p className="tile-note">{profile.focus}</p>
					<p className="tile-foot">{current.dates}</p>
				</Tile>

				<Tile className="where" style={{ gridArea: 'where' }} delay={.2}>
					<p className="tile-label">Based in</p>
					<h2 className="tile-title">{profile.location}</h2>
					<LocalTime />
				</Tile>

				<Tile className="stack" style={{ gridArea: 'stack' }} delay={.12}>
					<p className="tile-label">Tech I use most</p>
					<ul className="chips">
						{profile.stack.map((s) => <li key={s}>{s}</li>)}
					</ul>
				</Tile>

				<Tile className="since" style={{ gridArea: 'since' }} delay={.16}>
					<p className="big-number">{projects.length}</p>
					<p className="tile-title">projects built</p>
					<p className="tile-note">across {experience.length} companies since {profile.careerStart}</p>
				</Tile>

				<Tile className="quick-contact" style={{ gridArea: 'contact' }} delay={.2}>
					<p className="tile-label">Get in touch</p>
					<a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a>
					<div className="row">
						<a className="btn btn-primary btn-small" href={`mailto:${profile.email}`}>Email me</a>
						<CopyEmail />
					</div>
				</Tile>
			</div>
		</section>
	);
}

// "Full-stack developer building ___" where the last words swap every few seconds
function RoleLine() {
	const reduce = useReducedMotion();
	const [word, setWord] = useState(0);

	useEffect(() => {
		if (reduce) return;
		const timer = setInterval(() => setWord((w) => (w + 1) % profile.roleWords.length), 2600);
		return () => clearInterval(timer);
	}, [reduce]);

	return (
		<p className="role">
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
		</p>
	);
}

// Your local time, ticking. Rendered on the client only, so the static HTML shows a placeholder.
function LocalTime() {
	const [time, setTime] = useState('');

	useEffect(() => {
		const format = () => new Date().toLocaleTimeString('en-IN', { timeZone: profile.timeZone, hour: '2-digit', minute: '2-digit', hour12: true });
		setTime(format());
		const timer = setInterval(() => setTime(format()), 15000);
		return () => clearInterval(timer);
	}, []);

	return (
		<p className="clock">
			<span>{time || '--:--'}</span> {profile.timeZoneLabel}
		</p>
	);
}
