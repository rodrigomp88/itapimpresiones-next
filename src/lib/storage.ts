import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseApp } from '@/firebase';

function getStorageInstance() {
  return getStorage(getFirebaseApp());
}

export async function uploadDesignFile(
  budgetId: string,
  file: File,
): Promise<string> {
  const storage = getStorageInstance();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `designs/${budgetId}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
