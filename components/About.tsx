import Image from 'next/image';
import { about, profile } from '@/lib/data';
import { Reveal } from './ui';

export default function About() {
	return (
		<section className="section" id="about">
			<div className="wrap about">
				<Reveal>
					<figure className="portrait" data-tilt>
						<Image src={profile.photo.src} width={profile.photo.width} height={profile.photo.height} alt={`Portrait of ${profile.name}`} />
					</figure>
				</Reveal>
				<Reveal className="about-copy" delay={.1}>
					<h2>About me</h2>
					<p className="lead">{about.lead}</p>
					{about.paragraphs.map((p) => <p key={p}>{p}</p>)}
					<dl className="facts">
						<div>
							<dt>Phone</dt>
							<dd><a href={profile.phoneHref}>{profile.phone}</a></dd>
						</div>
						<div>
							<dt>Email</dt>
							<dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
						</div>
						<div>
							<dt>Location</dt>
							<dd>{profile.location}</dd>
						</div>
					</dl>
				</Reveal>
			</div>
		</section>
	);
}
