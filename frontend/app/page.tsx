'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../services/config/init';

export default function LandingPage() {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				router.push('/home');
			}
		});

		return () => unsubscribe();
	}, [router]);

	return (
		<div className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Navigation */}
			<nav className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-gray-700/50 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<div className="flex-shrink-0 flex items-center">
								<div className="relative">
									<div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
									<svg className="relative h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 2L1 21h22L12 2zm0 4.6L19.1 19H4.9L12 6.6z" />
									</svg>
								</div>
								<span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">AI Hedge Fund UI</span>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => {
									const html = document.documentElement;
									const isDark = html.classList.contains('dark');
									html.classList.toggle('dark', !isDark);
								}}
								className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
							>
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
									/>
								</svg>
							</button>
							<Link
								href="/login"
								className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
							>
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/20 dark:to-transparent"></div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
					<div className="text-center">
						<div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full mb-8 shadow-lg">
							<span className="text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1">
								AI-Powered Financial Analysis
							</span>
						</div>
						<h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
							<span className="block">Transform Your</span>
							<span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">Investment Strategy</span>
						</h1>
						<p className="mt-6 max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400">
							Leverage artificial intelligence to analyze hedge fund strategies, optimize portfolios, and make data-driven investment decisions.
						</p>
						<div className="mt-10 flex justify-center space-x-4">
							<Link
								href="/login"
								className="group relative px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200"
							>
								<span className="relative z-10">Get Started</span>
								<div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-md blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
							</Link>
							<a
								href="#features"
								className="group relative px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-lg transition-all duration-200"
							>
								<span className="relative z-10">Learn More</span>
								<div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
							</a>
						</div>
					</div>
					
					{/* Stats Section */}
					<div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
							<div className="relative">
								<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">100+</div>
								<div className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Hedge Funds Analyzed</div>
								<div className="mt-1 text-slate-500 dark:text-slate-400">Comprehensive data on top performing funds</div>
							</div>
						</div>
						<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
							<div className="relative">
								<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">24/7</div>
								<div className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Real-Time Monitoring</div>
								<div className="mt-1 text-slate-500 dark:text-slate-400">Stay updated with market changes</div>
							</div>
						</div>
						<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
							<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
							<div className="relative">
								<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">AI</div>
								<div className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Powered Insights</div>
								<div className="mt-1 text-slate-500 dark:text-slate-400">Advanced algorithms for better decisions</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div id="features" className="relative py-16 bg-gradient-to-b from-white to-green-50 dark:from-gray-800 dark:to-gray-900">
				<div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/20 dark:to-transparent"></div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<div className="text-center">
						<h2 className="text-base bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 font-semibold tracking-wide uppercase">Features</h2>
						<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
							Everything you need to analyze hedge funds
						</p>
						<p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400">
							Our platform provides powerful tools to help you make informed investment decisions.
						</p>
					</div>

					<div className="mt-16">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
							{/* Feature 1 */}
							<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
								<div className="relative">
									<div className="absolute -top-4 -left-4 flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
										<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<div className="ml-8">
										<h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Analytics</h3>
										<p className="mt-2 text-base text-slate-500 dark:text-slate-400">
											Analyze hedge fund performance with sophisticated metrics and visualizations.
										</p>
									</div>
								</div>
							</div>

							{/* Feature 2 */}
							<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
								<div className="relative">
									<div className="absolute -top-4 -left-4 flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
										<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
									</div>
									<div className="ml-8">
										<h3 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Insights</h3>
										<p className="mt-2 text-base text-slate-500 dark:text-slate-400">
											Get intelligent recommendations based on historical data and market trends.
										</p>
									</div>
								</div>
							</div>

							{/* Feature 3 */}
							<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
								<div className="relative">
									<div className="absolute -top-4 -left-4 flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
										<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
									</div>
									<div className="ml-8">
										<h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Platform</h3>
										<p className="mt-2 text-base text-slate-500 dark:text-slate-400">
											Your data is protected with enterprise-grade security and encryption.
										</p>
									</div>
								</div>
							</div>

							{/* Feature 4 */}
							<div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-6 border border-slate-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
								<div className="relative">
									<div className="absolute -top-4 -left-4 flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
										<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div className="ml-8">
										<h3 className="text-xl font-bold text-slate-900 dark:text-white">Real-Time Updates</h3>
										<p className="mt-2 text-base text-slate-500 dark:text-slate-400">
											Stay informed with real-time market data and portfolio performance updates.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="relative bg-gradient-to-r from-green-600 to-emerald-600">
				<div className="absolute inset-0 bg-gradient-to-r from-green-600/50 to-emerald-600/50 blur-3xl"></div>
				<div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative">
					<h2 className="text-3xl font-extrabold text-white sm:text-4xl">
						<span className="block">Ready to get started?</span>
						<span className="block">Sign up for free today.</span>
					</h2>
					<p className="mt-4 text-lg leading-6 text-green-100">
						Join thousands of investors who are already using our platform to make better investment decisions.
					</p>
					<Link
						href="/login"
						className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
					>
						Get started
					</Link>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
					<p className="mt-8 text-center text-base text-slate-500 dark:text-slate-400">
						&copy; 2024 AI Hedge Fund UI. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
