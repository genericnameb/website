if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const LocalStrategy = require('passport-local').Strategy
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

app.set('view-engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const urlOpen = "https://finnhub.io/api/v1/quote?symbol=";
const urlEnd = "&token=bubpc2v48v6r5j83rvb0";
// MongoDB
const url = 'mongodb+srv://admin:admin@practiceserver.dz9k4.mongodb.net/practice-database?retryWrites=true&w=majority';

// Passport
passport.use (new LocalStrategy(
    function(username, password, done){
        MongoClient.connect(url, function(err, client){
            if (err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
            }
            console.log('Connected...');
            const collection = client.db('website-database').collection("users");
            collection.findOne({
                username:username,
            }, function(err, user){
                if (err) throw err;
                if (user == null) {
                    return done(null, false, { message : 'No user with that username'});
                }
                if (bcrypt.compareSync(password, user.password)){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Password'})
                }
            });
            client.close();
        })
        passport.serializeUser((user, done) => {
            console.log(user);
            done(null, user)
        });
        passport.deserializeUser((user, done) => {
            console.log(user);
            done(null, user)
        });
    }
))

// Stock quote API
app.get('/api/stock/:id', (req, res) => {
    let stock = req.params.id;
    fetch(urlOpen + stock + urlEnd)
            .then(res => res.json())
            .then(function(data){
                console.log("no error")
                res.send(data);
            })
            .catch(function (err){
                //error
                console.log('Something happened', err)
                res.send('error');
            });
})

// Get User Data
app.get('/api/users', (req, res) => {
    MongoClient.connect(url, function(err, client){
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db('website-database').collection("users");
    collection.find().toArray(function(err, items){
        console.log(items);
        res.send(items);
    })
       client.close();
    });
})

// Get practice individual user initial API
app.get('/api/users/:username/practice', (req, res) => {
    MongoClient.connect(url, function(err, client){
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db('website-database').collection("users");
    collection.findOne({
        username:req.params.username,
    }, function(err, user){
        if (err) throw err;
        res.send(user)
    });
       client.close();
    });
})

// Get practice account cash API
app.get('/api/users/:username/practice/holdings', (req, res) => {
    MongoClient.connect(url, function(err, client){
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db('website-database').collection("holdings");
    collection.find({username: req.params.username}).toArray(function(err, items){
        console.log(items);
        res.send(items);
    })
       client.close();
    });
})

// Get practice transaction API
app.get('/api/users/:username/practice/transactions', (req, res) => {
    MongoClient.connect(url, function(err, client){
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db('website-database').collection("transactions");
    collection.find({username: req.params.username}).toArray(function(err, items){
        console.log(items);
        res.send(items);
    })
       client.close();
    });

})

// Get total holdings API;
app.get('/api/users/:username/practice/total', (req, res) => {
    MongoClient.connect(url, function(err, client){
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    const collection = client.db('website-database').collection("transactions");
    collection.find({username: req.params.username}).toArray(function(err, data){
        console.log(data);
        let totalHoldings = [];
        let removeZero = [];
        for (let z=0; z<data.length; z++){
            let unique = true
            for (let y=0; y<totalHoldings.length; y+=3){
                if (data[z].symbol ===  totalHoldings[y]){
                    unique = false;
                    if(data[z].type === "buy"){
                        var purchaseShares = data[z].shares;
                    } else {
                        var purchaseShares = -1 * data[z].shares;
                    }
                    console.log(purchaseShares);
                    let oldShares = totalHoldings[y+1];
                    let oldCost = totalHoldings[y+2];
                    let purchaseCost = data[z].price;
                    let newShares = oldShares + purchaseShares;
                    let newCost
                    if (oldShares + purchaseShares === 0){
                        newCost = 0;
                    } else {
                        newCost = ((oldShares * oldCost) + (purchaseShares * purchaseCost))/(oldShares + purchaseShares)
                    }
                    totalHoldings[y+1] = newShares;
                    totalHoldings[y+2] = newCost;
                }
            }
            if (unique) {
                totalHoldings.push(data[z].symbol)
                if(data[z].type === "buy"){
                    totalHoldings.push(data[z].shares)
                } else {
                    let negativeStocks = -1 * parseInt(data[z][shares])
                    totalHoldings.push(negativeStocks)
                }
                totalHoldings.push(data[z].price)
            }
        }
        

        for (let u=1; u<totalHoldings.length; u+=3){
            if(totalHoldings[u] != 0){
                removeZero.push(totalHoldings[u-1]);
                removeZero.push(totalHoldings[u]);
                removeZero.push(totalHoldings[u+1]);
            }
        }
        res.send(removeZero);
    })
       client.close();
    });

})

// Root directory
app.get('/', (req, res) => {
    let urlProtocol =  req.protocol;
    let urlHost = req.get('host');
    let urlStart = urlProtocol + '://' + urlHost;
    let root = urlStart + '/index/index.html'
    res.redirect(root)
});

// Contact
app.post('/contact-me', (req, res) =>{
    MongoClient.connect(url, function(err, client){
        if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
        }
        console.log('Connected...');
        const collection = client.db('website-database').collection("contact");
        collection.insertOne({
            name: req.body.name,
            email: req.body.email,
            comments: req.body.comments
        })
        client.close();
    });
    res.send('Thanks for the message');
})

// NOT YET IMPLEMENTED - WAS FOR GRAPH TRACKING NET WORTH
// Finance Redirect
// app.get('/finance', (req, res) => {
//     res.redirect('/finance/'+req.user.username+'/networth');
// })

// Practice Redirect
app.get('/finance/practice', (req, res) => {
    res.redirect('/finance/'+req.user.username+'/practice');
})

// Trade Redirect in Practice Account
app.get('/finance/practice/trade', checkAuthenticated, (req, res) => {
    res.redirect('/finance/'+req.user.username+'/practice/trade')
})

// Trade in Practice Account
app.get('/finance/:username/practice/trade', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname,"/public/practice_account/buy_sell.html"));
})

//  Buy and Sell Stocks
app.post('/finance/practice/trade', checkAuthenticated, (req, res) => {

    let holdingsData
    let capitalData
    let stockData
    let transactionType = req.body.transaction;
    let urlProtocol =  req.protocol;
    let urlHost = req.get('host');
    let urlStart = urlProtocol + '://' + urlHost;

    async function getCapital(){
        let captialResponse = await fetch(urlStart + '/api/users/' + req.user.username + '/practice/holdings');
        capitalData = await captialResponse.json();
    }

    async function getStock(){
        let stockResponse = await fetch(urlStart + '/api/stock/' + req.body.symbol);
        stockData = await stockResponse.json();
    }

    async function getHoldings(){
        let holdingsResponse = await fetch(urlStart + '/api/users/' + req.user.username +'/practice/total')
        holdingsData = await holdingsResponse.json();
    }

    if (transactionType === "buy") {
        getCapital().then(function(){
            getStock().then(function(){
                let accountCapital = parseInt(capitalData[0]["capital"])
                let symbol = req.body.symbol;
                let quantity = parseInt(req.body.qty);
                let stockPrice = stockData.c
                if ( quantity * stockPrice > accountCapital){
                    res.send("Insufficient Funds");
                } else {
                    let remainingCash = accountCapital - (quantity * stockPrice);
                    MongoClient.connect(url, function(err, client){
                        if(err) {
                            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
                        }
                        console.log('Connected...');
                        const collection = client.db('website-database').collection("transactions");
                        collection.insertOne({
                            username: req.user.username,
                            date: new Date,
                            type: transactionType,
                            symbol: symbol,
                            price: stockPrice,
                            shares: quantity
                        })
                        const holdingsCollection = client.db('website-database').collection('holdings');
                        holdingsCollection.updateOne(
                            {username:req.user.username},
                            {$set: {
                                capital: remainingCash
                            }}
                        )
                        client.close();
                    });
                    res.send(`You ${transactionType} ${quantity} shares of ${symbol} at ${stockPrice}`)
                }
            })
        })
    } else if (transactionType === "sell") {
        let sellSymbol = req.body.symbol;
        let sellQuantity = parseInt(req.body.qty);
        let ownStock = false
        getCapital().then(function(){
            getHoldings().then(function(){
                getStock().then(function(){
                    let sellPrice = stockData.c
                    for (let n=0; n<holdingsData.length; n += 3){
                        if (holdingsData[n] === sellSymbol){
                            ownStock = true
                        }
                    }
                    if (ownStock){
                        let newCapital = parseInt(capitalData[0]["capital"]);
                        newCapital = newCapital + sellPrice * sellQuantity
                        MongoClient.connect(url, function(err, client){
                            if(err) {
                                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
                            }
                            console.log('Connected...');
                            const collection = client.db('website-database').collection("transactions");
                            collection.insertOne({
                                username: req.user.username,
                                date: new Date,
                                type: transactionType,
                                symbol: sellSymbol,
                                price: sellPrice,
                                shares: sellQuantity
                            })
                            const holdingsCollection = client.db('website-database').collection('holdings');
                            holdingsCollection.updateOne(
                                {username:req.user.username},
                                {$set: {
                                    capital: newCapital
                                }}
                            )
                            client.close();
                            res.send(`You ${transactionType} ${sellQuantity} shares of ${sellSymbol} at ${sellPrice}`)
                        });
                    } else {
                        res.send("Can't sell stocks you don't own friend")
                    }
                })
            })
        })
    }

})

// Practice Account
app.get('/finance/:username/practice', (req, res) => {
    res.sendFile(path.join(__dirname,"/public/practice_account/index.html"));
})

// NOT YET IMPLEMENTED
// // Net Worth
// app.get('/finance/:username/networth', (req, res) => {
//     res.sendFile(path.join(__dirname,"/public/stock_tracker/index.html"));
// })


// Authenticataion
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/finance/practice',
    failureRedirect: '/login',
    failureFlash: true,
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

// Create account
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        fetch(urlOpen + 'VOO' + urlEnd)
        .then(res => res.json())
        .then(function(data){
            console.log("no error")
            let hypotheticalVOO = Math.floor(req.body.capital / data.c);
            let hypotheticalCash = (req.body.capital % data.c).toFixed(2);
            MongoClient.connect(url, function(err, client){
                if(err) {
                    console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
                }
                console.log('Connected...');
                const collection = client.db('website-database').collection("users");
                collection.insertOne({
                    username:req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    capital:req.body.capital,
                    VOO_price:data.c,
                    hypothetical_VOO:hypotheticalVOO,
                    hypothetical_Cash:hypotheticalCash,
                    date: new Date(),
                })
                const holdingCollection = client.db('website-database').collection("holdings")
                holdingCollection.insertOne({
                    username:req.body.username,
                    capital:req.body.capital
                })
                client.close();
            });
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

// Logout
app.delete('/logout', (req, res) =>{
    req.logOut();
    res.redirect('/login');
})

// Authentication Checks
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return res.redirect('/finance/practice');
    }
    next();
}

app.listen(PORT);