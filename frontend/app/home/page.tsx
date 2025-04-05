'use client';

import HedgeFundForm from '@/components/HedgeFundForm';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Home() {
	return (
		<ProtectedRoute>
			<div className="py-6">
				<HedgeFundForm />
			</div>
		</ProtectedRoute>
	);
} 