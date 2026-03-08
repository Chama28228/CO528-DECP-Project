export type { StorageService } from './StorageService';
export { FirebaseStorageService } from './FirebaseStorageService';
import { FirebaseStorageService } from './FirebaseStorageService';
export const storageService = new FirebaseStorageService();
