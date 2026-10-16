'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState, type CSSProperties } from 'react';
import { projects, type Filter } from '@/lib/data';
import { tracePath } from '@/lib/traces';
import { Reveal, SectionHead, ease } from './ui';

const filters: Filter[] = ['All', 'AI', 'Web', 'Mobile'];
const countFor = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.categories.includes(f)).length);

export default function Projects() {
	const [filter, setFilter] = useState<Filter>('All');
	const shown = projects.filter((p) => filter === 'All' || p.categories.includes(filter));

	return (
		<section className="section" id="projects">
			<div className="wrap">
				<SectionHead title="Projects" text="A selection of products I've built, from AI agents and payment systems to e-commerce and mobile apps." />

				<Reveal className="filters" role="group" aria-label="Filter projects">
					{filters.map((f) => (
						<button key={f} type="button" className="filter-btn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
							{filter === f && <motion.span className="filter-pill" layoutId="filter-pill" transition={{ type: 'spring', bounce: .2, duration: .5 }} />}
							<span className="filter-label">
								{f}
								<span className="filter-count">{countFor(f)}</span>
							</span>
						</button>
					))}
				</Reveal>

				<div className="projects">
					<AnimatePresence mode="popLayout">
						{shown.map((p, i) => (
							<motion.article
								key={p.name}
								layout
								className={`project-item${p.featuredIn?.includes(filter) ? ' featured' : ''}`}
								initial={{ opacity: 0, y: 28 }}
								whileInView={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: .95, transition: { duration: .2 } }}
								viewport={{ once: true, amount: .15 }}
								transition={{ duration: .6, ease, delay: (i % 3) * .08 }}
							>
								<div className="card project" data-spot data-tilt style={{ '--h1': p.hue[0], '--h2': p.hue[1] } as CSSProperties}>
									<div className="project-visual">
										<svg className="trace" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
											<path d={tracePath(p.trace)} />
										</svg>
									</div>
									<div className="card-body">
										<span className="tag">{p.tag}</span>
										<h3>{p.name}</h3>
										<p>{p.description}</p>
									</div>
								</div>
							</motion.article>
						))}
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
