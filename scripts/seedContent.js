/**
 * Content Seeding Script
 * Reads all validated JSON content files from /content and idempotently
 * upserts them into Firestore using the Firebase Admin SDK.
 * Also seeds default config/gameRules.
 *
 * Supports local Firestore Emulator via FIRESTORE_EMULATOR_HOST environment variable.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '../content');

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'cyberlingo-app';

// Configure Firebase Admin
if (!admin.apps.length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`🔌 Connecting to Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
    admin.initializeApp({ projectId });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId
    });
  } else {
    // Fallback development mode for local development/emulator
    console.log(`ℹ️ Initializing Firebase Admin with project ID '${projectId}'`);
    admin.initializeApp({ projectId });
  }
}

const db = admin.firestore();

/**
 * Seed default game rules in config/gameRules if not exists
 */
async function seedGameRules() {
  const rulesRef = db.doc('config/gameRules');
  const rulesDoc = await rulesRef.get();

  const defaultRules = {
    xp: {
      lessonBase: 10,
      perfectBonus: 5,
      speedBonus: 2,
      practiceBase: 5
    },
    hearts: {
      max: 5,
      regenIntervalHours: 4,
      refillCostGems: 350
    },
    streak: {
      freezeCostGems: 200,
      dailyXpGoals: [10, 20, 30, 50]
    },
    gems: {
      lessonComplete: 10,
      perfectLessonBonus: 10,
      dailyQuestBase: 15
    },
    leagues: {
      tiers: ['Bronze', 'Silver', 'Gold', 'Sapphire', 'Diamond'],
      membersPerLeague: 30,
      promoteCount: 10,
      demoteCount: 5
    },
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  if (!rulesDoc.exists) {
    console.log('📝 Creating default config/gameRules in Firestore...');
    await rulesRef.set(defaultRules);
  } else {
    console.log('🔄 config/gameRules already exists, updating...');
    await rulesRef.set(defaultRules, { merge: true });
  }
}

/**
 * Seed a single track JSON file into Firestore subcollections
 */
async function seedTrack(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const track = JSON.parse(raw);

  console.log(`\n📦 Seeding track: ${track.trackId} - "${track.title}" (version ${track.version})...`);

  const trackRef = db.doc(`tracks/${track.trackId}`);
  await trackRef.set(
    {
      title: track.title,
      order: track.order || 1,
      description: track.description || '',
      version: track.version || 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  let totalUnits = 0;
  let totalLessons = 0;
  let totalExercises = 0;

  for (const unit of track.units || []) {
    totalUnits++;
    const unitRef = db.doc(`tracks/${track.trackId}/units/${unit.unitId}`);
    await unitRef.set(
      {
        title: unit.title,
        order: unit.order,
        color: unit.color,
        guidebook: unit.guidebook || '',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    for (const lesson of unit.lessons || []) {
      totalLessons++;
      const lessonRef = db.doc(`tracks/${track.trackId}/units/${unit.unitId}/lessons/${lesson.lessonId}`);
      await lessonRef.set(
        {
          title: lesson.title,
          order: lesson.order,
          exerciseCount: lesson.exercises?.length || 0,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      // Write exercises in batches
      const batch = db.batch();
      let orderIndex = 1;

      for (const exercise of lesson.exercises || []) {
        totalExercises++;
        const exerciseRef = db.doc(
          `tracks/${track.trackId}/units/${unit.unitId}/lessons/${lesson.lessonId}/exercises/${exercise.id}`
        );

        const exercisePayload = {
          ...exercise,
          order: orderIndex++,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        batch.set(exerciseRef, exercisePayload, { merge: true });
      }

      await batch.commit();
    }
  }

  console.log(`✅ Seeded ${track.trackId}: ${totalUnits} units, ${totalLessons} lessons, ${totalExercises} exercises.`);
}

async function main() {
  try {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      console.log('⚠️ No content JSON files found to seed.');
      process.exit(0);
    }

    await seedGameRules();

    for (const file of files) {
      await seedTrack(path.join(CONTENT_DIR, file));
    }

    console.log('\n🎉 Content seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

main();
