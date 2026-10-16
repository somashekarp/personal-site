import { profile } from '@/lib/data';

export default function Footer() {
	return (
		<footer className="foot">
			<div className="wrap foot-inner">
				<p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
				<ul className="social">
					<li><a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
					<li><a href={profile.github} target="_blank" rel="noopener">GitHub</a></li>
					<li><a href={profile.facebook} target="_blank" rel="noopener">Facebook</a></li>
				</ul>
			</div>
		</footer>
	);
}
