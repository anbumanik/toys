import React, { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Baby } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Shop All Toys', href: '/shop' },
			{ title: 'Categories', href: '/categories' },
			{ title: 'Best Sellers', href: '/best-sellers' },
			{ title: 'New Arrivals', href: '/new-arrivals' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '/about' },
			{ title: 'Contact Us', href: '/contact' },
			{ title: 'Privacy Policy', href: '/privacy-policy' },
			{ title: 'Terms of Services', href: '/terms' },
		],
	},
	{
		label: 'Help & Policies',
		links: [
			{ title: 'Track My Order', href: '/order-tracking' },
			{ title: 'FAQ', href: '/faq' },
			{ title: 'Refund Policy', href: '/refund-policy' },
			{ title: 'Special Offers', href: '/offers' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Facebook', href: '#', icon: FaFacebook },
			{ title: 'Instagram', href: '#', icon: FaInstagram },
			{ title: 'Youtube', href: '#', icon: FaYoutube },
			{ title: 'Twitter', href: '#', icon: FaTwitter },
		],
	},
];

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className as string}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className as string}
		>
			{children}
		</motion.div>
	);
}

export default function Footer() {
	return (
		<footer className="relative w-full mx-auto flex flex-col items-center justify-center border-t bg-[#111827] text-white px-6 py-12 lg:py-16 overflow-hidden">
			<div className="bg-[#2563EB]/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="max-w-7xl grid w-full gap-8 xl:grid-cols-3 xl:gap-8 relative z-10">
				<AnimatedContainer className="space-y-4">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-md text-white">
							<Baby size={22} />
						</div>
						<div>
							<div className="text-xl font-extrabold text-white leading-none" style={{ fontFamily: 'Outfit' }}>
								Child<span className="text-[#FACC15]">Toys</span>
							</div>
							<div className="text-[10px] text-[#F97316] font-semibold tracking-wide">Play. Learn. Grow.</div>
						</div>
					</div>
					<p className="text-gray-400 mt-8 text-sm md:mt-0 max-w-sm">
						India's favourite destination for baby toys, educational games, and premium gift items for little ones.
					</p>
					<p className="text-gray-500 mt-4 text-xs">
						© {new Date().getFullYear()} ChildToys. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-base font-bold text-white">{section.label}</h3>
								<ul className="text-gray-400 mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<Link
												to={link.href}
												className="hover:text-[#FACC15] inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-2 size-4" />}
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}
