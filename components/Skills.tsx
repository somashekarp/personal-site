import { skills } from '@/lib/data';
import { SectionHead, Tile } from './ui';

export default function Skills() {
	return (
		<section className="section" id="skills">
			<div className="wrap">
				<SectionHead title="Skills" text="Technologies I work with, grouped by area." />
				<div className="skills-grid">
					<Tile className="ai">
						<p className="tile-label">Main focus</p>
						<h3 className="tile-title">{skills.ai.title}</h3>
						<p className="tile-note">{skills.ai.description}</p>
						{/* A tiny picture of an agentic workflow */}
						<div className="flow" aria-hidden="true">
							<span>Trigger</span>
							<i />
							<span className="flow-agent">AI agent</span>
							<i />
							<span>Action</span>
						</div>
						<Chips items={skills.ai.items} />
					</Tile>
					{skills.groups.map((g, i) => (
						<Tile key={g.title} delay={.06 + i * .06}>
							<h3 className="tile-title">{g.title}</h3>
							<Chips items={g.items} />
						</Tile>
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
