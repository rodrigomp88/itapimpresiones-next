#!/usr/bin/env tsx

/**
 * Script de backup automático para Firestore
 * Se ejecuta periódicamente para mantener copias de seguridad de la base de datos
 */

import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../src/utils/logger';

// Inicializar Firebase Admin
const initializeFirebase = () => {
  if (!admin.apps.length) {
    const serviceAccount = require('../functions/serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    });
  }
};

// Función para crear backup completo de Firestore
const createFirestoreBackup = async () => {
  try {
    logger.info('Starting Firestore backup process');

    const db = getFirestore();
    const backupDir = path.join(process.cwd(), 'backups');

    // Crear directorio de backups si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `firestore-backup-${timestamp}.json`);

    logger.info('Fetching all collections from Firestore');

    // Obtener todas las colecciones
    const collections = await db.listCollections();
    const backupData: { [key: string]: any[] } = {};

    for (const collectionRef of collections) {
      const collectionName = collectionRef.id;
      logger.info(`Backing up collection: ${collectionName}`);

      const snapshot = await collectionRef.get();
      const documents: any[] = [];

      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
          createTime: doc.createTime,
          updateTime: doc.updateTime,
        });
      });

      backupData[collectionName] = documents;
      logger.info(`Collection ${collectionName}: ${documents.length} documents`);
    }

    // Agregar metadata del backup
    const backupMetadata = {
      timestamp: new Date().toISOString(),
      collectionsCount: Object.keys(backupData).length,
      totalDocuments: Object.values(backupData).reduce((sum, docs) => sum + docs.length, 0),
      version: '1.0',
    };

    const fullBackup = {
      metadata: backupMetadata,
      data: backupData,
    };

    // Escribir archivo de backup
    fs.writeFileSync(backupFile, JSON.stringify(fullBackup, null, 2));
    logger.info(`Backup completed successfully: ${backupFile}`);

    // Limpiar backups antiguos (mantener solo los últimos 30)
    await cleanupOldBackups(backupDir);

    return {
      success: true,
      file: backupFile,
      collections: Object.keys(backupData).length,
      documents: backupMetadata.totalDocuments,
    };

  } catch (error) {
    logger.error('Error creating Firestore backup', { error: error as Error });
    throw error;
  }
};

// Función para limpiar backups antiguos
const cleanupOldBackups = async (backupDir: string) => {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('firestore-backup-') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        stats: fs.statSync(path.join(backupDir, file)),
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

    // Mantener solo los últimos 30 backups
    if (files.length > 30) {
      const filesToDelete = files.slice(30);

      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
        logger.info(`Deleted old backup: ${file.name}`);
      }
    }
  } catch (error) {
    logger.warn('Error cleaning up old backups', { error: error as Error });
  }
};

// Función para verificar integridad del backup
const verifyBackupIntegrity = (backupFile: string) => {
  try {
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    if (!backupData.metadata || !backupData.data) {
      throw new Error('Invalid backup structure');
    }

    const { metadata, data } = backupData;

    // Verificar que las colecciones existan
    const collectionsCount = Object.keys(data).length;
    if (collectionsCount !== metadata.collectionsCount) {
      throw new Error('Collections count mismatch');
    }

    // Verificar que el total de documentos sea correcto
    const totalDocuments = Object.values(data).reduce((sum: number, docs: any) => sum + (docs as any[]).length, 0);
    if (totalDocuments !== metadata.totalDocuments) {
      throw new Error('Documents count mismatch');
    }

    logger.info('Backup integrity verified successfully');
    return true;

  } catch (error) {
    logger.error('Backup integrity check failed', { error: error as Error, backupFile });
    return false;
  }
};

// Función principal
const main = async () => {
  try {
    logger.info('=== FIRESTORE BACKUP SCRIPT STARTED ===');

    // Verificar variables de entorno requeridas
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('FIREBASE_PROJECT_ID environment variable is required');
    }

    // Inicializar Firebase
    initializeFirebase();

    // Crear backup
    const result = await createFirestoreBackup();

    // Verificar integridad
    const isValid = verifyBackupIntegrity(result.file);

    if (isValid) {
      logger.info('=== FIRESTORE BACKUP COMPLETED SUCCESSFULLY ===', {
        file: result.file,
        collections: result.collections,
        documents: result.documents,
      });

      console.log(`✅ Backup completed: ${result.file}`);
      console.log(`📊 Collections: ${result.collections}`);
      console.log(`📄 Documents: ${result.documents}`);

    } else {
      throw new Error('Backup integrity check failed');
    }

  } catch (error) {
    logger.error('Firestore backup failed', { error: error as Error });
    console.error('❌ Backup failed:', (error as Error).message);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

export { createFirestoreBackup, verifyBackupIntegrity };
