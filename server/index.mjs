import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult} from 'express-validator';

import {getUser} from './user-dao.mjs';
import {Meme, Game, Caption} from './Models.mjs';
import {getMemes, getCaptions, getMemeSolutions, getGamesOfUser, saveGame} from './meme-dao.mjs';

// Passport-related imports -- NEW
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
// set up and enable CORS -- UPDATED
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy -- NEW
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//Meme API

// Get all memes
app.get('/api/memes', async (req, res) => {
  await getMemes()
  .then(memes => {
    res.json(memes);
  })
  .catch(err => res.status(500).json({error: 'Database error'}));
});

// Get a random meme
app.get('/api/memes/random', async (req, res) => {
  const pastMemes = req.query.pastMemes ? req.query.pastMemes.split(',').map(Number) : [];
  await getMemes()
  .then(memes => {
    const filteredMemes = memes.filter(meme => !pastMemes.includes(meme.id));
    console.log(filteredMemes);
    if (filteredMemes.length === 0) {
      return res.status(404).json({error: 'No new memes available'});
    }
    
    const randomIndex = Math.floor(Math.random() * filteredMemes.length);
    res.json(filteredMemes[randomIndex]);
  })
  .catch(err => res.status(500).json({error: 'Database error'})); 
});

// Get captions for a meme with 5 random captions and the 2 correct ones
app.get("/api/captions/:idMeme", async (req, res) => {
  const idMeme = req.params.idMeme;
  let result = [];
  await getCaptions() //get all captions
  .then(captions => {
    getMemeSolutions(idMeme) //get solutions for the meme
    .then(solutions => {

      const correctCaptions = solutions.sort(() => Math.random() - 0.5).slice(0, 2); // 2 correct captions from solutions set

      const incorrectCaptions = captions.filter(caption => {
        return !correctCaptions.some(solution => solution.id === caption.id);
      });

      const randomIncorrectCaptions = [];
      while(randomIncorrectCaptions.length + correctCaptions.length < 7) { //loop until i have 5 different incorrect captions
        const randomIndex = Math.floor(Math.random() * incorrectCaptions.length);
        if(!randomIncorrectCaptions.includes(incorrectCaptions[randomIndex]))
          randomIncorrectCaptions.push(incorrectCaptions[randomIndex]);
      }

      result = correctCaptions.concat(randomIncorrectCaptions); //concat correct and incorrect captions
      result = result.sort(() => Math.random() - 0.5);
      console.log(result);
      res.json(result);
    })
  })
});

//Get all meme solutions, used for displaying the correct captions after end of the round
app.get("/api/memes/solution/:idMeme", async (req, res) => {
  const idMeme = req.params.idMeme;
  await getMemeSolutions(idMeme)
  .then(solutions => {
    console.log(solutions);
    res.json(solutions);
  })
  .catch(err => res.status(500).json({error: 'Database error'}));
});

//Check if the selected caption is correct
app.post('/api/memes/solution/:idMeme', async (req, res) => {
  const idMeme = req.params.idMeme;
  const idCaption = req.body.idCaption;
  check('idCaption').isInt();
  await getMemeSolutions(idMeme)
  .then(solutions => {
    const isSolution = solutions.some(solution => solution.id === idCaption);
    res.json(isSolution);
  })
  .catch(err => res.status(500).json({error: 'Database error'}));
});

app.get('/api/games/:idUser', isLoggedIn,  async (req, res) => {
  const idUser = req.params.idUser;
  await getGamesOfUser(idUser)
  .then(games => {
    res.json(games);
  })
  .catch(err => res.status(500).json({error: 'Database error'}));
});

app.post('/api/games', isLoggedIn,  async (req, res) => {
  check('idUser').isInt();
  check('score').isInt();
  check('idMeme1').isInt();
  check('idMeme2').isInt();
  check('idMeme3').isInt();
  check('correct1').isInt();
  check('correct2').isInt();
  check('correct3').isInt();
  const game = req.body;
  await saveGame(game.idUser, game.score, game.idMeme1, game.idMeme2, game.idMeme3, game.correct1, game.correct2, game.correct3)
  .then(() => res.status(201).end())
  .catch(err => res.status(500).json({error: 'Database error'}));
});

//Auth API

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          return res.status(201).json(req.user);
        });
    })(req, res, next);
  });
  
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });
  
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});