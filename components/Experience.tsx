import { experience, profile } from '@/lib/data';
import { Reveal, Tile } from './ui';

export default function Experience() {
	return (
		<section className="section" id="experience">
			<div className="wrap exp-layout">
				{/* Stays in view while the timeline scrolls past on wide screens */}
				<Reveal className="exp-intro">
					<h2>Experience</h2>
					<p>My professional experience, most recent first.</p>
					<p className="exp-stat">
						<strong>{new Date().getFullYear() - profile.careerStart}+ years</strong> building web, mobile and AI products
					</p>
				</Reveal>

				{/* The line beside these cards fills as you scroll (see Effects) */}
				<ol className="timeline">
					{experience.map((job, i) => (
						<Tile as="li" key={job.company} delay={i * .06}>
							<span className="dot" aria-hidden="true" />
							<div className="tile-top">
								<span className="date">{job.dates}</span>
							</div>
							<h3 className="tile-title">{job.role}</h3>
							<p className="accent">{job.company}</p>
							<ul className="points">
								{job.points.map((point) => <li key={point}>{point}</li>)}
							</ul>
						</Tile>
					))}
				</ol>
			</div>
		</section>
	);
}
