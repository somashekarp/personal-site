// All the text on the site lives here. Edit this file to change content;
// the components only handle layout and animation.

import type { TraceName } from './traces';

const whatsappText = encodeURIComponent('Hi Praneeth, I found your website and would like to discuss a project.');

export const profile = {
	name: 'Somasekhar Praneeth',
	logo: 'Somashekar',
	// The hero cycles through these after "Full-stack developer building"
	roleWords: ['AI agents', 'web applications', 'mobile apps'],
	roleSentence: 'Full-stack developer building web applications, mobile apps and AI-powered products.',
	intro: 'Based in Hyderabad, India. Currently building AI automation for healthcare at Atelia Softwares.',
	location: 'Hyderabad, India',
	email: 'praneeth4138@gmail.com',
	phone: '+91 81438 27703',
	phoneHref: 'tel:+918143827703',
	whatsapp: `https://api.whatsapp.com/send?phone=918143827703&text=${whatsappText}`,
	linkedin: 'https://www.linkedin.com/in/p-somasekhar-praneeth',
	github: 'https://github.com/somashekar4138',
	facebook: 'https://www.facebook.com/somashekar.praneeth41',
	photo: { src: '/images/me.jpg', width: 824, height: 1030 },
	availability: 'Available for freelance work',
	focus: 'Building AI automation for healthcare.',
	timeZone: 'Asia/Kolkata',
	timeZoneLabel: 'IST',
	careerStart: 2021,
	// Shown in the "Tech I use most" tile at the top of the page
	stack: ['Agentic AI', 'React', 'Next.js', 'Node.js', 'NestJS', 'Python', 'PostgreSQL', 'React Native'],
};

export const about = {
	lead: "I'm a full-stack developer who builds complete products, from the user interface to the backend services and, more recently, the AI agents that power them.",
	paragraphs: [
		'I began my career in 2021 as a backend intern at Oorwin, working on a resume parser, a job portal and a CRM. I went on to build invoicing and real estate products at Grow Global, and today I develop AI automation for healthcare at Atelia Softwares.',
		'I hold a B.Tech in Electrical and Electronics Engineering and bring the same structured, systems-level thinking to software. I value clean design and maintainable code, and I deliver on time and within budget.',
	],
};

export type Category = 'AI' | 'Web' | 'Mobile';
export type Filter = 'All' | Category;

export type Project = {
	name: string;
	tag: string;
	description: string;
	categories: Category[];
	trace: TraceName;
	hue: [number, number];
	// Larger tile under these filters ('big' = 2x2, 'wide' = 2x1), picked so every row ends full
	size?: Partial<Record<Filter, 'big' | 'wide'>>;
};

export const projects: Project[] = [
	{
		name: 'Metafrost',
		tag: 'Agentic AI',
		description: 'AI agents that generate forecast reports, with agentic features for the insurance sector that scale to reporting for multinational companies.',
		categories: ['AI'],
		trace: 'rise',
		hue: [205, 245],
		size: { All: 'big', AI: 'big' },
	},
	{
		name: 'Medicare',
		tag: 'Healthcare AI',
		description: 'AI agents that support medical teams by assisting in emergency situations.',
		categories: ['AI'],
		trace: 'ecg',
		hue: [350, 300],
	},
	{
		name: 'Drishti AI',
		tag: 'Conversational AI',
		description: 'An AI assistant on WhatsApp that lets people book deliveries, travel and other services through a simple chat.',
		categories: ['AI'],
		trace: 'square',
		hue: [145, 190],
	},
	{
		name: 'Grow Global',
		tag: 'Crypto payment gateway',
		description: "A custom payment gateway package for accepting payments in Grow Global's own cryptocurrency.",
		categories: ['Web'],
		trace: 'market',
		hue: [45, 20],
		size: { All: 'wide', Web: 'wide' },
	},
	{
		name: 'Growinvoice',
		tag: 'Invoicing web app',
		description: 'An invoice management system for creating and tracking invoices, used daily by 100+ users.',
		categories: ['Web'],
		trace: 'ledger',
		hue: [185, 220],
	},
	{
		name: 'Kheloo',
		tag: 'Web and mobile app',
		description: 'A booking platform for sports venues and games, available on the web and as a mobile app.',
		categories: ['Web', 'Mobile'],
		trace: 'zigzag',
		hue: [275, 315],
		size: { All: 'wide' },
	},
	{
		name: 'Indoor Roots',
		tag: 'E-commerce, Laravel',
		description: 'An online store for a plant nursery, built with Laravel, where customers can browse and order plants.',
		categories: ['Web'],
		trace: 'sprout',
		hue: [100, 150],
	},
	{
		name: 'Bidding Next',
		tag: 'Bidding platform',
		description: 'An online bidding platform where users bid on gift cards to earn rewards.',
		categories: ['Web'],
		trace: 'steps',
		hue: [330, 290],
	},
	{
		name: 'Food Bird',
		tag: 'React Native, NestJS',
		description: 'A food delivery app built with React Native and powered by a NestJS backend.',
		categories: ['Mobile'],
		trace: 'bounce',
		hue: [18, 335],
	},
	{
		name: 'AgentHub',
		tag: 'React Native, NestJS',
		description: 'A real estate mobile app built with React Native and powered by a NestJS backend.',
		categories: ['Mobile'],
		trace: 'skyline',
		hue: [228, 262],
	},
];

export const experience = [
	{
		role: 'Full-Stack Developer',
		company: 'Atelia Softwares',
		dates: '2023 – Present',
		points: [
			'Built an AI automation solution that streamlines communication between doctors and patients.',
			'Developed a hospital portal with end-to-end appointment and schedule management.',
			"Integrated AI capabilities across the platform's services.",
		],
	},
	{
		role: 'Full-Stack Developer',
		company: 'Grow Global',
		dates: '2022 – 2023',
		points: [
			'Developed an invoice management web application used daily by 100+ users.',
			'Built a real estate mobile app used daily by 100+ users.',
			'Developed a web platform for property investment.',
		],
	},
	{
		role: 'Backend Intern',
		company: 'Oorwin',
		dates: '2021 – 2022',
		points: [
			'Contributed to a resume parser that extracts candidate data and stores it in the database.',
			'Worked on a job portal web application used daily by 100+ users.',
			'Worked on a CRM web application used daily by 100+ users.',
		],
	},
];

export const education = [
	{
		degree: 'Bachelor of Technology',
		dates: '2020 – 2023',
		school: 'Electrical and Electronics Engineering, Sasi College',
		note: 'Final-year project: a hydrogen-powered vehicle designed to reduce pollution.',
	},
	{
		degree: 'Diploma',
		dates: '2002 – 2006',
		school: 'Electrical and Electronics Engineering, Sasi College',
		note: 'Final-year project: a study of how electrical substations operate.',
	},
];

export const skills = {
	ai: {
		title: 'Agentic AI',
		description: 'Designing agentic workflows and building custom AI agents that automate business processes.',
		items: ['Agentic AI', 'AI workflows', 'Custom AI agents'],
	},
	groups: [
		{ title: 'Frontend', items: ['React', 'Next.js', 'AngularJS', 'HTML5', 'CSS3', 'jQuery', 'UI design'] },
		{ title: 'Backend', items: ['Node.js', 'NestJS', 'Python', 'Laravel', 'PHP'] },
		{ title: 'Mobile', items: ['React Native', 'Ionic'] },
		{ title: 'Databases and CMS', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'WordPress'] },
	],
};

export type ServiceIcon = 'bot' | 'layout' | 'code' | 'pen' | 'chart' | 'megaphone' | 'chat';

export const services: { icon: ServiceIcon; title: string; description: string; highlight?: boolean }[] = [
	{ icon: 'bot', title: 'Custom AI agents', description: 'Agentic AI workflows and custom AI agents, built around your business, that take repetitive work off your team.', highlight: true },
	{ icon: 'layout', title: 'Web design', description: 'Modern, responsive websites that look great and work well on every screen.' },
	{ icon: 'code', title: 'Web development', description: 'Custom web applications built with React, Next.js, Node.js, NestJS, Laravel and PHP.' },
	{ icon: 'pen', title: 'Branding', description: 'Logos, business cards and letterheads that give your business a consistent identity.' },
	{ icon: 'chart', title: 'Analytics', description: 'Analytics setup and reporting with Google Analytics, so you can see how visitors use your site.' },
	{ icon: 'megaphone', title: 'Digital marketing', description: 'SEO, search advertising and social media marketing that help the right customers find you.' },
	{ icon: 'chat', title: 'Maintenance and support', description: 'Ongoing updates, fixes and support for the websites I build.' },
];
