'use client';

import { useState, useEffect } from 'react';
import { userService, CREDIT_PACKAGES } from '@/services/user/user.service';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CreditsPage() {
	const [credits, setCredits] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadCredits = async () => {
			try {
				setLoading(true);
				const data = await userService.getUserCredits();
				setCredits(data.credits);
				setError(null);
			} catch (err) {
				console.error('Error loading credits:', err);
				setError('Failed to load credits');
			} finally {
				setLoading(false);
			}
		};

		loadCredits();
	}, []);

	const handlePurchase = async (packageId: string) => {
		try {
			const { url, error } = await userService.createCheckoutSession(
				packageId
			);

			if (error) {
				setError(error);
				return;
			}

			if (url) {
				window.location.assign(url);
			}
		} catch (error) {
			console.error('Error creating checkout session:', error);
			setError('Failed to create checkout session');
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
			</div>
		);
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center">
						<h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
							Refill Your Credits
						</h2>
						<p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
							Current Credits: {credits}
						</p>
					</div>

					<div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
						{CREDIT_PACKAGES.map((pkg) => (
							<div
								key={pkg.id}
								className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800"
							>
								<div className="px-6 py-8">
									<h3 className="text-2xl font-medium text-gray-900 dark:text-white">
										{pkg.label}
									</h3>
									<p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white">
										${pkg.price}
									</p>
									<p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
										{pkg.credits} credits
									</p>
								</div>
								<div className="flex-1 flex flex-col justify-between px-6 pb-8">
									<button
										onClick={() => handlePurchase(pkg.id)}
										className="mt-8 block w-full bg-green-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-green-700"
									>
										Purchase
									</button>
								</div>
							</div>
						))}
					</div>

					{error && (
						<div className="mt-8 text-center text-red-600 dark:text-red-400">
							{error}
						</div>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}
