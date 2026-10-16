import { about, education } from '@/lib/data';
import { SectionHead, Tile } from './ui';

export default function About() {
	return (
		<section className="section" id="about">
			<div className="wrap">
				<SectionHead title="About me" text="Who I am, how I got here and what I studied." />
				<div className="about-grid">
					<Tile className="about-bio">
						<p className="lead">{about.lead}</p>
						{about.paragraphs.map((p) => <p key={p}>{p}</p>)}
					</Tile>
					{education.map((e, i) => (
						<Tile className="edu" key={e.degree} delay={.08 + i * .08}>
							<div className="tile-top">
								<p className="tile-label">Education</p>
								<span className="date">{e.dates}</span>
							</div>
							<h3 className="tile-title">{e.degree}</h3>
							<p className="accent">{e.school}</p>
							<p className="tile-note">{e.note}</p>
						</Tile>
					))}
				</div>
			</div>
		</section>
	);
}
