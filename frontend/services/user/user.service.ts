import { db, auth } from '../config/init';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export interface UserCredits {
  userId: string;
  credits: number;
  lastUpdated: Date;
}

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
        lastUpdated: new Date()
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
        lastUpdated: new Date()
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
      const currentCredits = (newUserDoc.data() as UserCredits)?.credits || 100;
      if (currentCredits < amount) {
        throw new Error('Insufficient credits');
      }
      await updateDoc(userRef, {
        credits: increment(-amount),
        lastUpdated: new Date()
      });
      return;
    }

    const currentCredits = (userDoc.data() as UserCredits)?.credits || 100;
    if (currentCredits < amount) {
      throw new Error('Insufficient credits');
    }

    await updateDoc(userRef, {
      credits: increment(-amount),
      lastUpdated: new Date()
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
      lastUpdated: new Date()
    });
  }
}

export const userService = new UserService(); 