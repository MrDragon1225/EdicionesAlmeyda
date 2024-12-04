import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user.js';


passport.serializeUser((User,done) => {
    done(null, User.id); 
});

passport.deserializeUser(async(id,done) => {
    const user = await User.findById(id);
    done(null,user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({email: email});
    if (user) {
        return done(null, false, req.flash('signupMessage', 'El email ya existe'))
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
    
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {

    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('signinMessage', 'Usuario no encontrado'));
    } 
    if (!user.comparePassword(password)) {
        return done(null,false, req.flash('signinMessage', 'Contraseña Incorrecta'))
    }
    done(null, user)
}));



export default passport;