import { education, experience } from '@/lib/data';
import { Reveal, SectionHead } from './ui';

export default function Experience() {
	return (
		<section className="section" id="experience">
			<div className="wrap">
				<SectionHead title="Experience" text="My professional experience, most recent first." />

				{/* The line beside these cards fills as you scroll (see Effects) */}
				<ol className="timeline">
					{experience.map((job) => (
						<Reveal as="li" className="card" key={job.company}>
							<div className="job-head">
								<h3>{job.role} <span>at {job.company}</span></h3>
								<span className="date">{job.dates}</span>
							</div>
							<ul>
								{job.points.map((point) => <li key={point}>{point}</li>)}
							</ul>
						</Reveal>
					))}
				</ol>

				<Reveal as="div">
					<h3 className="sub">Education</h3>
				</Reveal>
				<div className="education">
					{education.map((e, i) => (
						<Reveal className="card" key={e.degree} delay={i * .08}>
							<div className="job-head">
								<h4>{e.degree}</h4>
								<span className="date">{e.dates}</span>
							</div>
							<p className="school">{e.school}</p>
							<p>{e.note}</p>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
