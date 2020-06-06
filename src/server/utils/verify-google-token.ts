import { OAuth2Client } from 'google-auth-library';

export async function verifyGoogleToken(token: string) {
  const client = new OAuth2Client(
    '109219587503-s86rl00mo43u2tgu0fojrqtq4p6lh654.apps.googleusercontent.com'
  );
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '109219587503-s86rl00mo43u2tgu0fojrqtq4p6lh654.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    if (payload) {
      const userId = payload.sub;
      return userId;
    }
    return null;
  } catch {
    return null;
  }
}
