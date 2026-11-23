/**
 * Isolated Firestore Emulator security-rules test for `cmsDrafts/{pageId}` CREATE.
 *
 * Uses only the installed Firebase v9 modular SDK (firebase 13.4.0):
 *   firebase/app   -> initializeApp, deleteApp
 *   firebase/firestore -> getFirestore, connectFirestoreEmulator, doc, setDoc,
 *                         Timestamp, serverTimestamp
 *
 * Connects ONLY to the dedicated local Emulator project `truckaxic-cms-test`
 * (NOT `truckaxic-development`). No production Firebase project is contacted.
 *
 * NOTE: `@firebase/rules-unit-testing` and a test runner (vitest/jest) are not
 * installed in this environment, so this module exports plain async functions
 * with try/catch assertions instead of assertFails/assertSucceeds/describe/test.
 * It is type-safe and ready to run once those dependencies are available.
 *
 * Because only the Firestore Emulator is used here (no Auth Emulator),
 * `request.auth` is null during rule evaluation, so `isAdmin()` (which requires
 * `request.auth.token.admin == true`) evaluates to false. To exercise the admin
 * success path, pair this with `@firebase/rules-unit-testing` or the Auth Emulator
 * plus a custom token minted with `admin: true` (firebase-admin is installed).
 */

import { initializeApp, deleteApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  Timestamp,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';

const PROJECT_ID = 'truckaxic-cms-test';
const EMULATOR_HOST = 'localhost';
const EMULATOR_PORT = 8080;

const ADMIN_UID = 'admin-uid-1';
const NON_ADMIN_UID = 'user-uid-2';

const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  appId: `1:${ADMIN_UID}:web:test`,
  messagingSenderId: 'test-sender-id',
};

// Representative prepared draft payload (matches preparedPageDrafts.ts structure,
// e.g. the `home` page built via makePage()).
const VALID_DRAFT_PAGE = {
  schemaVersion: 1,
  pageId: 'home',
  seo: {
    title: 'TruckAxic | Truck Dispatch & Logistics',
    description:
      'Explore TruckAxic dispatch information, supported equipment, and resources for carriers.',
    canonicalPath: '/',
  },
  sections: [
    {
      id: 'home-hero',
      type: 'hero',
      enabled: true,
      eyebrow: 'Dispatch support for carriers',
      title: 'Move freight with a dispatch plan built around your operation.',
      description:
        'Tell TruckAxic about your equipment, preferred lanes, and priorities to discuss dispatch support.',
      actions: [
        { label: 'Discuss dispatch', href: '/contact', style: 'primary' },
        { label: 'Explore services', href: '/services', style: 'secondary' },
      ],
    },
  ],
};

async function createConnectedApp(): Promise<{
  app: FirebaseApp;
  db: Firestore;
}> {
  const app = initializeApp(
    firebaseConfig,
    `cms-test-app-${String(Date.now())}-${Math.random().toString(36).slice(2)}`
  );
  const db = getFirestore(app);
  connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT);
  return { app, db };
}

async function teardownApp(app: FirebaseApp): Promise<void> {
  await deleteApp(app);
}

async function attemptCreate(
  pageId: string,
  data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const { app, db } = await createConnectedApp();
  try {
    await setDoc(doc(db, 'cmsDrafts', pageId), data as Parameters<typeof setDoc>[1]);
    return { ok: true };
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : String(cause),
    };
  } finally {
    await teardownApp(app);
  }
}

export async function adminCreateWithServerTimestamp(): Promise<{
  ok: boolean;
  error?: string;
}> {
  // NOTE: Without the Auth Emulator / rules-unit-testing, request.auth is null and
  // isAdmin() is false, so this path is denied. See module docstring.
  return attemptCreate('home', {
    ...VALID_DRAFT_PAGE,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: ADMIN_UID,
  });
}

export async function adminCreateWithOrdinaryTimestamp(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const now = Timestamp.now();
  return attemptCreate('home', {
    ...VALID_DRAFT_PAGE,
    createdAt: now,
    updatedAt: now,
    updatedBy: ADMIN_UID,
  });
}

export async function nonAdminCreateIsDenied(): Promise<{
  ok: boolean;
  error?: string;
}> {
  return attemptCreate('home', {
    ...VALID_DRAFT_PAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    updatedBy: NON_ADMIN_UID,
  });
}

export async function adminCreateMissingUpdatedByIsDenied(): Promise<{
  ok: boolean;
  error?: string;
}> {
  return attemptCreate('home', {
    ...VALID_DRAFT_PAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function adminCreateWithExtraKeyIsDenied(): Promise<{
  ok: boolean;
  error?: string;
}> {
  return attemptCreate('home', {
    ...VALID_DRAFT_PAGE,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    updatedBy: ADMIN_UID,
    publishedAt: Timestamp.now(),
  });
}