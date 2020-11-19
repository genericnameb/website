const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
// MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:admin@practiceserver.dz9k4.mongodb.net/practice-database?retryWrites=true&w=majority';


function initialize(passport, getUserByUsername) {
    const authenticateUser = (username, password, done) =>{
        const user = getUserByUsername(username)
        console.log(user)
        if (user == null) {
            return done(null, false, { message : 'No user with that username'});
        }
        MongoClient.connect(url, function(err, client){
            if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log('Connected...');
            const collection = client.db('website-database').collection("users");
            collection.findOne({
                username:username,
            }, function(err, result){
                if(err) throw err;
                try {
                    if ( bcrypt.compare(password, result.password)){
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password incorrect'})
                    }
                } catch (e) {
                    return done(e)
                }
            });
            client.close();
        });


    }
    passport.use(new LocalStrategy({ usernameField: 'username'}, authenticateUser));
    passport.serializeUser((user, done) => {});
    passport.serializeUser((id, done) => {});
}

module.exports = initialize