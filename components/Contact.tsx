import { profile } from '@/lib/data';
import { CopyEmail, Tile } from './ui';

const links = [
	{ label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
	{ label: 'WhatsApp', value: profile.phone, href: profile.whatsapp, external: true },
	{ label: 'LinkedIn', value: 'p-somasekhar-praneeth', href: profile.linkedin, external: true },
	{ label: 'GitHub', value: 'somashekar4138', href: profile.github, external: true },
];

export default function Contact() {
	return (
		<section className="section" id="contact">
			<div className="wrap contact-grid">
				<Tile className="contact-cta">
					<h2>Have a project in mind?</h2>
					<p>I&apos;m currently available for freelance projects. Send me a message with a few details about what you need, and I&apos;ll get back to you as soon as possible.</p>
					<div className="actions">
						<a className="btn btn-primary" href={`mailto:${profile.email}`} data-magnetic>Send an email</a>
						<a className="btn btn-ghost" href={profile.phoneHref} data-magnetic>Call me</a>
						<CopyEmail />
					</div>
				</Tile>
				{links.map((l, i) => (
					<Tile className="link-tile" key={l.label} delay={.06 + i * .06}>
						<a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
							<span className="tile-label">{l.label}</span>
							<span className="link-value">{l.value}</span>
							<svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
						</a>
					</Tile>
				))}
			</div>
		</section>
	);
}
