import { 
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/init';
import { auth } from '../config/init';

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  results: Record<string, any> | null;
  createdAt: Date;
  status: 'completed' | 'failed' | 'in_progress';
  errorMessage?: string;
}

export const analysisService = {
  async createAnalysis(data: Omit<Analysis, 'id' | 'userId' | 'createdAt'>): Promise<Analysis> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    // Debug auth and data
    console.log('Creating analysis with auth:', {
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      isAnonymous: auth.currentUser.isAnonymous,
      providerData: auth.currentUser.providerData
    });

    const analysisData = {
      ...data,
      userId: auth.currentUser.uid,
      createdAt: Timestamp.now(),
    };

    // Debug the final data being sent to Firestore
    console.log('Sending to Firestore:', JSON.stringify(analysisData, null, 2));

    try {
      // Verify collection exists
      const analysesRef = collection(db, 'analyses');
      console.log('Collection reference:', analysesRef.path);

      const docRef = await addDoc(analysesRef, analysisData);
      console.log('Document written with ID:', docRef.id);
      
      const docSnap = await getDoc(docRef);
      console.log('Retrieved document:', docSnap.data());
      
      return {
        id: docRef.id,
        ...docSnap.data(),
        createdAt: docSnap.data()?.createdAt.toDate(),
      } as Analysis;
    } catch (error: any) {
      console.error('Firestore error details:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        stack: error?.stack
      });
      throw error;
    }
  },

  async getAnalyses(): Promise<Analysis[]> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Analysis[];
  },

  async getAnalysis(id: string): Promise<Analysis> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    console.log('Fetching analysis with ID:', id);
    console.log('Current user:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    });

    const docRef = doc(db, 'analyses', id);
    console.log('Document reference path:', docRef.path);

    try {
      const docSnap = await getDoc(docRef);
      console.log('Document exists:', docSnap.exists());
      
      if (!docSnap.exists()) {
        throw new Error('Analysis not found');
      }

      const data = docSnap.data();
      console.log('Document data:', data);
      
      if (data.userId !== auth.currentUser.uid) {
        console.error('User ID mismatch:', {
          documentUserId: data.userId,
          currentUserId: auth.currentUser.uid
        });
        throw new Error('Unauthorized access');
      }

      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Analysis;
    } catch (error: any) {
      console.error('Error fetching analysis:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        stack: error?.stack
      });
      throw error;
    }
  },

  async deleteAnalysis(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const docRef = doc(db, 'analyses', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Analysis not found');
    }

    if (docSnap.data().userId !== auth.currentUser.uid) {
      throw new Error('Unauthorized access');
    }

    await deleteDoc(docRef);
  },

  async updateAnalysis(id: string, data: Partial<Analysis>): Promise<Analysis> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const docRef = doc(db, 'analyses', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Analysis not found');
    }

    if (docSnap.data().userId !== auth.currentUser.uid) {
      throw new Error('Unauthorized access');
    }

    await updateDoc(docRef, data);
    
    const updatedDoc = await getDoc(docRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt.toDate(),
    } as Analysis;
  },
}; 