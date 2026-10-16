'use client';

import { motion } from 'motion/react';
import type { ComponentProps } from 'react';

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

export function SectionHead({ title, text }: { title: string; text: string }) {
	return (
		<Reveal className="section-head">
			<h2>{title}</h2>
			<p>{text}</p>
		</Reveal>
	);
}
