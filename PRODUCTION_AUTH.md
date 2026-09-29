# Production Google sign-in

The current Firebase Hosting site uses project `adaptiq-fa584`. Firebase Authentication → Settings → Authorized domains must contain `adaptiq.study`; it was added on September 28, 2026, preserving the existing domains. Google is enabled as a sign-in provider.

Both the landing page and app use `signInWithPopup` directly from a user click. The existing Firebase auth domain stays `adaptiq-fa584.firebaseapp.com`, retaining its existing Google OAuth handler registration. This follows [Firebase's popup option](https://firebase.google.com/docs/auth/web/redirect-best-practices#popup) to avoid cross-domain redirect storage restrictions. Blocked and cancelled popups show retry guidance. Existing redirect results are still processed for users returning from an older release.

Run `node --test tests/auth-production.test.cjs`. These are mocked flow checks and syntax validation; a real Google account must still complete a browser sign-in to verify the full provider round trip.

This hotfix is based on the deployed Firebase version, independent of the AWS migration and interview design branches. Production deployment replaces only `index.html` and `app.html`, preserving the prior Hosting configuration and other file hashes. Once moving to the AWS server, configure the Google Identity Services web client's authorized JavaScript origin as `https://adaptiq.study` and the server's `APP_ORIGIN` to the same value; Firebase's domain list does not configure that separate authentication flow.
