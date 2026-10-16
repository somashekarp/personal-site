import { skills } from '@/lib/data';
import { Reveal, SectionHead } from './ui';

export default function Skills() {
	return (
		<section className="section" id="skills">
			<div className="wrap">
				<SectionHead title="Skills" text="Technologies I work with, grouped by area." />
				<div className="skills">
					<Reveal className="card ai">
						<h3>{skills.ai.title}</h3>
						<p>{skills.ai.description}</p>
						<Chips items={skills.ai.items} />
					</Reveal>
					{skills.groups.map((g, i) => (
						<Reveal className="card" key={g.title} delay={i * .08}>
							<h3>{g.title}</h3>
							<Chips items={g.items} />
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

function Chips({ items }: { items: string[] }) {
	return (
		<ul className="chips">
			{items.map((item) => <li key={item}>{item}</li>)}
		</ul>
	);
}
