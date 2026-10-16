'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { profile } from '@/lib/data';
import { Reveal } from './ui';

const copyLabels = { idle: 'Copy email', done: 'Email copied', failed: 'Copy failed, use the address below' };

export default function Contact() {
	const [copy, setCopy] = useState<keyof typeof copyLabels>('idle');
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			setCopy('done');
		} catch {
			setCopy('failed');
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopy('idle'), 2500);
	}

	return (
		<section className="section" id="contact">
			<div className="wrap">
				<Reveal className="contact card" data-spot>
					<h2>Have a project in mind?</h2>
					<p>I&apos;m currently available for freelance projects. Send me a message with a few details about what you need, and I&apos;ll get back to you as soon as possible.</p>
					<div className="actions">
						<a className="btn btn-primary" href={`mailto:${profile.email}`} data-magnetic>Send an email</a>
						<a className="btn btn-ghost" href={profile.whatsapp} target="_blank" rel="noopener" data-magnetic>Message on WhatsApp</a>
						<a className="btn btn-ghost" href={profile.phoneHref} data-magnetic>Call me</a>
					</div>
					<p className="contact-line">
						{profile.email} <span aria-hidden="true">/</span> <span className="nowrap">{profile.phone}</span>
					</p>
					<button type="button" className={`copy-btn ${copy}`} onClick={copyEmail}>
						<AnimatePresence mode="wait" initial={false}>
							<motion.span key={copy} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
								{copyLabels[copy]}
							</motion.span>
						</AnimatePresence>
					</button>
					<span className="sr" aria-live="polite">{copy === 'idle' ? '' : copyLabels[copy]}</span>
				</Reveal>
			</div>
		</section>
	);
}
