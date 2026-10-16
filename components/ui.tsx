'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { profile } from '@/lib/data';

export const ease = [0.2, 0.7, 0.2, 1] as const;

type RevealProps = { as?: 'div' | 'li'; delay?: number } & ComponentProps<typeof motion.div>;

// Fades and lifts content into place the first time it scrolls into view.
export function Reveal({ as = 'div', delay = 0, ...props }: RevealProps) {
	const Tag = motion[as] as typeof motion.div;
	return (
		<Tag
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15 }}
			transition={{ duration: 0.7, ease, delay }}
			{...props}
		/>
	);
}

// A bento tile: rounded panel whose edge lights up near the mouse.
export function Tile({ className = '', ...props }: RevealProps) {
	return <Reveal className={`tile ${className}`} data-spot {...props} />;
}

export function SectionHead({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
	return (
		<Reveal className="section-head">
			<div>
				<h2>{title}</h2>
				<p>{text}</p>
			</div>
			{children}
		</Reveal>
	);
}

const copyLabels = { idle: 'Copy email', done: 'Email copied', failed: 'Copy failed' };

export function CopyEmail() {
	const [state, setState] = useState<keyof typeof copyLabels>('idle');
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	async function copy() {
		try {
			await navigator.clipboard.writeText(profile.email);
			setState('done');
		} catch {
			setState('failed');
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setState('idle'), 2500);
	}

	return (
		<button type="button" className={`copy-btn ${state}`} onClick={copy}>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
					{copyLabels[state]}
				</motion.span>
			</AnimatePresence>
			<span className="sr" aria-live="polite">{state === 'idle' ? '' : copyLabels[state]}</span>
		</button>
	);
}
