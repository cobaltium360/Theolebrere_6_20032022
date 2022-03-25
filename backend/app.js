const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const authRoutes = require('./Routes/auth');
const saucesRoutes = require('./Routes/sauces');
const rateLimit = require('express-rate-limit');
var helmet = require('helmet');
require('dotenv').config()

app.use(express.json());

mongoose.connect(process.env.MONGO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
})

app.use(limiter);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/auth', authRoutes);

app.use('/api/sauces', saucesRoutes);

module.exports = app;