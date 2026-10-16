import type { ReactNode } from 'react';
import { services, type ServiceIcon } from '@/lib/data';
import { SectionHead, Tile } from './ui';

const icons: Record<ServiceIcon, ReactNode> = {
	bot: <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 16h.01M16 16h.01" /></>,
	layout: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
	code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
	pen: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.6 7.6" /><circle cx="11" cy="11" r="2" /></>,
	chart: <><path d="M3 3v18h18" /><path d="M7 16v-5M12 16V8M17 16v-3" /></>,
	megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
	chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
};

export default function Services() {
	return (
		<section className="section" id="services">
			<div className="wrap">
				<SectionHead title="Services" text="How I can help your business." />
				<ul className="services-grid">
					{services.map((s, i) => (
						<Tile as="li" className={s.highlight ? 'service ai' : 'service'} key={s.title} delay={(i % 3) * .06}>
							<svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{icons[s.icon]}</svg>
							<div>
								<h3 className="tile-title">{s.title}</h3>
								<p className="tile-note">{s.description}</p>
							</div>
						</Tile>
					))}
				</ul>
			</div>
		</section>
	);
}
