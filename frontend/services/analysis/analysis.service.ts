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
import { db, auth } from '../config/init';
import { userService } from '../user/user.service';

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  description: string;
  parameters: any;
  results: any;
  createdAt: Date;
  status: 'completed' | 'failed' | 'in_progress';
  errorMessage?: string;
}

class AnalysisService {
  private readonly COLLECTION = 'analyses';

  async createAnalysis(data: Omit<Analysis, 'id' | 'userId' | 'createdAt'>): Promise<Analysis> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const analysisData = {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date())
    };

    try {
      // Verify collection exists
      const analysesRef = collection(db, this.COLLECTION);
      console.log('Collection reference:', analysesRef.path);

      // Add document to collection
      const docRef = await addDoc(analysesRef, analysisData);
      console.log('Document added with ID:', docRef.id);

      // Get the created document
      const docSnap = await getDoc(docRef);
      console.log('Document data:', docSnap.data());

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data()?.createdAt.toDate()
      } as Analysis;
    } catch (error: any) {
      console.error('Error creating analysis:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        stack: error?.stack
      });
      throw error;
    }
  }

  async getAnalyses(): Promise<Analysis[]> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const q = query(
      collection(db, this.COLLECTION),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Analysis[];
  }

  async getAnalysis(id: string): Promise<Analysis> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    console.log('Fetching analysis with ID:', id);
    console.log('Current user:', {
      uid: user.uid,
      email: user.email
    });

    const docRef = doc(db, this.COLLECTION, id);
    console.log('Document reference path:', docRef.path);

    const docSnap = await getDoc(docRef);
    console.log('Document exists:', docSnap.exists());

    if (!docSnap.exists()) {
      console.error('Analysis not found');
      throw new Error('Analysis not found');
    }

    const data = docSnap.data();
    console.log('Document data:', data);
    
    if (data.userId !== user.uid) {
      console.error('User ID mismatch:', {
        documentUserId: data.userId,
        currentUserId: user.uid
      });
      throw new Error('Unauthorized access');
    }

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate()
    } as Analysis;
  }

  async deleteAnalysis(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Analysis not found');
    }

    const analysis = docSnap.data() as Analysis;
    if (analysis.userId !== user.uid) {
      throw new Error('Unauthorized access to analysis');
    }

    await deleteDoc(docRef);
  }

  async updateAnalysis(id: string, data: Partial<Analysis>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const docRef = doc(db, this.COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Analysis not found');
    }

    const analysis = docSnap.data() as Analysis;
    if (analysis.userId !== user.uid) {
      throw new Error('Unauthorized access to analysis');
    }

    await updateDoc(docRef, data);
  }
}

export const analysisService = new AnalysisService(); 