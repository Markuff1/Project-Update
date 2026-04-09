import { useState, useEffect, useCallback } from 'react';
import { Trust, SSA } from '@/types/project';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

const COLLECTION = 'trusts';

const generateId = () => crypto.randomUUID();

const createEmptySSA = (): SSA => ({
  id: generateId(),
  ssaNumber: '',
  ssaName: '',
  sourceSystem: '',
  epicLink: '',
  adLink: '',
  testSuiteLink: '',
  data: '',
  documents: false,

  ssaStatus: 'Not Tested',
  ssaComment: '',
  crvStatus: 'Not Tested',
});

const createEmptyTrust = (): Trust => ({
  id: generateId(),
  trustName: 'New Trust',
  trustNumber: '',
  trustStatus: 'Not Live',
  crvComment: '',
  generalComments: '',
  ssas: [createEmptySSA()],
});

export function useProjectData() {
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION), (snapshot) => {
      const data: Trust[] = snapshot.docs.map(d => {
        const raw = d.data();

        return {
          id: d.id,
          trustName: raw.trustName || raw.name || 'Untitled',
          trustNumber: raw.trustNumber || String(raw.number || ''),
          trustStatus: raw.trustStatus || (raw.live ? 'Live' : 'Not Live'),
          crvComment: raw.crvComment || '',
          generalComments: raw.generalComments || '',

          ssas: Array.isArray(raw.ssas)
            ? raw.ssas.map((s: any) => ({
                ...s,
                // ✅ Ensure defaults for old data
                documents: s.documents ?? false,
                crvUrl: s.crvUrl ?? '',
              }))
            : [createEmptySSA()],
        } as Trust;
      });

      // Sort trusts by trust number numerically
      data.sort((a, b) => {
        const numA = parseInt(a.trustNumber, 10) || Infinity;
        const numB = parseInt(b.trustNumber, 10) || Infinity;
        return numA - numB;
      });

      // Sort SSAs within each trust by SSA number
      data.forEach(t => {
        t.ssas.sort((a, b) => {
          const numA = parseInt(a.ssaNumber, 10) || Infinity;
          const numB = parseInt(b.ssaNumber, 10) || Infinity;
          return numA - numB;
        });
      });

      setTrusts(data);
      setLoading(false);
    });

    return unsub;
  }, []);

  const updateTrust = useCallback(async (trustId: string, updates: Partial<Trust>) => {
    // Optimistic update
    setTrusts(prev => prev.map(t => t.id === trustId ? { ...t, ...updates } : t));
    const trustRef = doc(db, COLLECTION, trustId);
    await updateDoc(trustRef, updates);
  }, []);

  const addTrust = useCallback(async () => {
    const trust = createEmptyTrust();
    setTrusts(prev => [...prev, trust]);
    await setDoc(doc(db, COLLECTION, trust.id), trust);
  }, []);

  const deleteTrust = useCallback(async (trustId: string) => {
    setTrusts(prev => prev.filter(t => t.id !== trustId));
    await deleteDoc(doc(db, COLLECTION, trustId));
  }, []);

  const updateSSA = useCallback(async (trustId: string, ssaId: string, updates: Partial<SSA>) => {
    setTrusts(prev => {
      const updated = prev.map(t => {
        if (t.id !== trustId) return t;
        return {
          ...t,
          ssas: t.ssas.map(s => s.id === ssaId ? { ...s, ...updates } : s)
        };
      });

      // Write full trust doc to Firestore
      const trust = updated.find(t => t.id === trustId);
      if (trust) setDoc(doc(db, COLLECTION, trustId), trust);

      return updated;
    });
  }, []);

  const addSSA = useCallback(async (trustId: string) => {
    setTrusts(prev => {
      const updated = prev.map(t => {
        if (t.id !== trustId) return t;
        return { ...t, ssas: [...t.ssas, createEmptySSA()] };
      });

      const trust = updated.find(t => t.id === trustId);
      if (trust) setDoc(doc(db, COLLECTION, trustId), trust);

      return updated;
    });
  }, []);

  const deleteSSA = useCallback(async (trustId: string, ssaId: string) => {
    setTrusts(prev => {
      const updated = prev.map(t => {
        if (t.id !== trustId) return t;
        return { ...t, ssas: t.ssas.filter(s => s.id !== ssaId) };
      });

      const trust = updated.find(t => t.id === trustId);
      if (trust) setDoc(doc(db, COLLECTION, trustId), trust);

      return updated;
    });
  }, []);

  const importTrusts = useCallback(async (newTrusts: Trust[]) => {
    for (const trust of newTrusts) {
      await setDoc(doc(db, COLLECTION, trust.id), trust);
    }
  }, []);

  return { trusts, loading, updateTrust, addTrust, deleteTrust, updateSSA, addSSA, deleteSSA, importTrusts };
}