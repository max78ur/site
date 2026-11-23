import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { GoogleAuth, UserRefreshClient } from 'google-auth-library';
import { isDeepStrictEqual } from 'node:util';

const targetProjectId = 'truckaxic-development';
const [uid, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');

if (
  !uid ||
  uid.startsWith('--') ||
  uid.length > 128 ||
  /\s/.test(uid) ||
  flags.some((flag) => flag !== '--apply') ||
  flags.length > 1
) {
  console.error(
    'Usage: npm run provision:admin-claim -- <FIREBASE_AUTH_UID> [--apply]',
  );
  console.error('Without --apply, the script performs a read-only dry run.');
  process.exitCode = 1;
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS !== undefined) {
  console.error(
    'Refusing to run with GOOGLE_APPLICATION_CREDENTIALS set. Use local gcloud ADC instead.',
  );
  process.exitCode = 1;
} else {
  const configuredProjects = [
    process.env.GCLOUD_PROJECT,
    process.env.GOOGLE_CLOUD_PROJECT,
  ].filter(Boolean);

  if (configuredProjects.some((project) => project !== targetProjectId)) {
    console.error(
      'Refusing to run: the configured project does not match the target.',
    );
    process.exitCode = 1;
  } else {
    let app;

    try {
      const adcClient = await new GoogleAuth().getClient();
      if (!(adcClient instanceof UserRefreshClient)) {
        console.error(
          'Refusing to run: use local gcloud user Application Default Credentials.',
        );
        process.exitCode = 1;
      } else {
        app = initializeApp({
          credential: applicationDefault(),
          projectId: targetProjectId,
        });

        if (app.options.projectId !== targetProjectId) {
          throw new Error('Target project verification failed.');
        }

        const auth = getAuth(app);
        const user = await auth.getUser(uid);

        if (!user.email || !user.emailVerified || user.disabled) {
          console.error(
            'Preflight failed: target must be an enabled account with a verified email.',
          );
          process.exitCode = 1;
        } else if (user.customClaims?.admin === true) {
          console.log(
            'The target account already has admin access; no change made.',
          );
        } else if (!apply) {
          console.log('Dry run passed. No custom claims were changed.');
          console.log('Re-run with --apply only after verifying the target UID.');
        } else {
          const latestUser = await auth.getUser(uid);
          const existingClaims = user.customClaims ?? {};
          const latestClaims = latestUser.customClaims ?? {};

          if (!isDeepStrictEqual(existingClaims, latestClaims)) {
            console.error(
              'Custom claims changed during preflight; aborting to avoid overwriting them.',
            );
            process.exitCode = 1;
          } else {
            await auth.setCustomUserClaims(uid, {
              ...latestClaims,
              admin: true,
            });

            const updatedUser = await auth.getUser(uid);
            if (updatedUser.customClaims?.admin !== true) {
              console.error('Claim verification failed after the update.');
              process.exitCode = 1;
            } else {
              console.log('Admin claim assigned and verified.');
              console.log(
                'The user must refresh their ID token or sign in again to receive the claim.',
              );
            }
          }
        }
      }
    } catch {
      console.error(
        'Provisioning failed. Credential details, tokens, and user data were suppressed.',
      );
      process.exitCode = 1;
    } finally {
      if (app) {
        try {
          await app.delete();
        } catch {
          console.error('Unable to close the local Admin SDK app cleanly.');
          process.exitCode = 1;
        }
      }
    }
  }
}
