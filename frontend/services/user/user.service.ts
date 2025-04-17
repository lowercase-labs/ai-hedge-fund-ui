import { db, auth } from '../config/init';
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	increment,
	collection,
	addDoc,
	onSnapshot,
} from 'firebase/firestore';

export interface UserCredits {
	userId: string;
	credits: number;
	lastUpdated: Date;
}

export interface CreditPackage {
	id: string;
	credits: number;
	price: number;
	label: string;
  stripeId: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
	{ id: 'basic', credits: 100, price: 10, label: 'Basic', stripeId: 'price_1REgXOGhJPQxFjoJEm6X1RF0' },
	{ id: 'pro', credits: 500, price: 45, label: 'Pro', stripeId: 'price_1REgXuGhJPQxFjoJeF8Y39K0' },
	{ id: 'premium', credits: 1000, price: 80, label: 'Premium', stripeId: 'price_1REgYKGhJPQxFjoJRGi8mdWa' },
];

class UserService {
	private readonly COLLECTION = 'users';

	async initializeUserCredits(): Promise<void> {
		const user = auth.currentUser;
		if (!user) throw new Error('User must be authenticated');

		const userRef = doc(db, this.COLLECTION, user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			// Initialize new user with 100 credits
			await setDoc(userRef, {
				userId: user.uid,
				credits: 100,
				lastUpdated: new Date(),
			});
		}
	}

	async getUserCredits(): Promise<UserCredits> {
		const user = auth.currentUser;
		if (!user) throw new Error('User must be authenticated');

		const userRef = doc(db, this.COLLECTION, user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			await this.initializeUserCredits();
			return {
				userId: user.uid,
				credits: 100,
				lastUpdated: new Date(),
			};
		}

		return userDoc.data() as UserCredits;
	}

	async deductCredits(amount: number = 1): Promise<void> {
		const user = auth.currentUser;
		if (!user) throw new Error('User must be authenticated');

		const userRef = doc(db, this.COLLECTION, user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			await this.initializeUserCredits();
			// Get the document again after initialization
			const newUserDoc = await getDoc(userRef);
			if (!newUserDoc.exists()) {
				throw new Error('Failed to initialize user credits');
			}
			const currentCredits =
				(newUserDoc.data() as UserCredits)?.credits || 100;
			if (currentCredits < amount) {
				throw new Error('Insufficient credits');
			}
			await updateDoc(userRef, {
				credits: increment(-amount),
				lastUpdated: new Date(),
			});
			return;
		}

		const currentCredits = (userDoc.data() as UserCredits)?.credits || 100;
		if (currentCredits < amount) {
			throw new Error('Insufficient credits');
		}

		await updateDoc(userRef, {
			credits: increment(-amount),
			lastUpdated: new Date(),
		});
	}

	async addCredits(amount: number): Promise<void> {
		const user = auth.currentUser;
		if (!user) throw new Error('User must be authenticated');

		const userRef = doc(db, this.COLLECTION, user.uid);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			await this.initializeUserCredits();
		}

		await updateDoc(userRef, {
			credits: increment(amount),
			lastUpdated: new Date(),
		});
	}

	async createCheckoutSession(
		packageId: string
	): Promise<{ url: string | null; error: string | null }> {
		const user = auth.currentUser;
		if (!user) throw new Error('User must be authenticated');

		const packageInfo = CREDIT_PACKAGES.find((p) => p.id === packageId);
		if (!packageInfo) throw new Error('Invalid package ID');

		try {
			const checkoutSessionRef = await addDoc(
				collection(db, 'customers', user.uid, 'checkout_sessions'),
				{
					mode: 'payment',
					price: packageInfo.stripeId, // Convert to cents
					success_url: `${window.location.origin}/credits?success=true`,
					cancel_url: `${window.location.origin}/credits?canceled=true`,
					metadata: {
						packageId,
						credits: packageInfo.credits,
					},
				}
			);

			return new Promise((resolve) => {
				const unsubscribe = onSnapshot(checkoutSessionRef, (snap) => {
					const { error, url } = snap.data() || {};
					if (error) {
						unsubscribe();
						resolve({ url: null, error: error.message });
					}
					if (url) {
						unsubscribe();
						resolve({ url, error: null });
					}
				});
			});
		} catch (error) {
			console.error('Error creating checkout session:', error);
			return { url: null, error: 'Failed to create checkout session' };
		}
	}
}

export const userService = new UserService();
