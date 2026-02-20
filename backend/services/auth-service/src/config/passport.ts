import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { OAuthService } from '@src/services/oauth.service';
import { UserResponseDTO } from '@src/types/response_dto';

dotenv.config();

const oAuthService = new OAuthService();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    passReqToCallback: false
},
async (accessToken, refreshToken, profile, done) => { //verify callback
    try {
        console.log("Google profile:", profile);
        const user : UserResponseDTO = await oAuthService.findOrCreateGoogleUser({
            sub: profile.id,
            email: profile.emails?.[0]?.value,
            given_name: profile.name?.givenName,
            family_name: profile.name?.familyName,
        });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error, undefined);
    }

}))