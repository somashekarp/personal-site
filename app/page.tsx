import About from '@/components/About';
import Contact from '@/components/Contact';
import Effects from '@/components/Effects';
import Experience from '@/components/Experience';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';

export default function Home() {
	return (
		<>
			<a className="skip" href="#main">Skip to content</a>
			<div className="grid-glow" aria-hidden="true" />
			<Header />
			<main id="main">
				<Hero />
				<About />
				<Projects />
				<Experience />
				<Skills />
				<Services />
				<Contact />
			</main>
			<Footer />
			<Effects />
		</>
	);
}
