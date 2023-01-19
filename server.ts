import { NextFunction, Request, Response } from "express";
require("dotenv").config();

const fetch = require('node-fetch')
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//config json
app.use(express.json());
app.use(cors());
// Models
const User = require('./models/User');
const client = require('./controllers/client')

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Está rodando" });
});

// Private Route
app.get('/user/:id', checkToken, async(req: Request, res: Response) => {

  const id = req.params.id;

  //check if user exists
  const user = await User.findById(id, '-password');

  if (!user) return res.status(404).json({message: "user not found"});

  return res.status(200).json({ user })

})

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ message: "access denied"});

  try {
    const secret = "FA8SH8FAH8FA8H8R213FG40G480FQH80FG80HWT435AWE"
    
    jwt.verify(token, secret)

    next()

  } catch (error) {
    res.status(400).json({ message: "unvalid token"})
  }
}

// Register User
app.post("/auth/register", async (req: Request, res: Response) => {

  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword)
  if (!name) return res.status(422).json({message: "please provide name"});

  if (!email) return res.status(422).json({message: "please provide email"});
  
  if (!password) return res.status(422).json({message: "please provide password"});

  if (password !== confirmPassword) return res.status(422).json({message: "passwords don't match"});

  // check if user exists
  const userExists = await User.findOne({email:email})

  if (userExists) return res.status(422).json({message: "email already used"});

  // create password
  const salt = await bycript.genSalt(12);
  const passwordHash = await bycript.hash(password, salt);

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash
  })

  try {

    await user.save();

    res.status(201).json({message: "user successfully created"})
    
  } catch (error) {
    res.status(500).json({message: error})
  }

});

// Login User
app.post("/auth/login", async (req:Request, res: Response) => {

  const {email, password} = req.body

  if (!email) return res.status(422).json({message: "please provide email"});
  
  if (!password) return res.status(422).json({message: "please provide password"});

  // check if user exists
  const user = await User.findOne({email:email})

  if (!user) return res.status(404).json({message: "user not found"});

  // check if password match
  const checkPassword = await bycript.compare(password, user.password)

  if (!checkPassword) return res.status(422).json({message: "invalid password"})

  try {
    const secret = "FA8SH8FAH8FA8H8R213FG40G480FQH80FG80HWT435AWE"

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    )

    return res.status(200).json({ message: "fully authenticated!", token})

  } catch (error) {
    res.status(500).json({message: error})

  }
   
})

// validate
app.post('/validate', async (req: Request, res: Response) => {
  const { token } = req.body.token
console.log(token)
  try {
    const secret = "FA8SH8FAH8FA8H8R213FG40G480FQH80FG80HWT435AWE"

    const tokenValidation = jwt.verify(token, secret)
    console.log(tokenValidation)
    return res.status(200).send(true)

  } catch (error) {
    res.status(500).json({message: 'unable to validate token'})

  }
})

// cat
app.post('/cat', async (req: Request, res: Response) => {
  const { cat } = req.body
  console.log(cat)
  const response = fetch('https://http.cat/100')
  const app = await response
  // console.log(app)

  return res.status(200)
})

// dog
app.get('/randomdog', async function (req: Request, res: Response) {
  const response = await fetch('https://random.dog/doggos')
  const dogs = await response.json()

  const filteredDogs = dogs.filter((dog: string) => !dog.includes('.mp4'))

  const randomNum = Math.floor( Math.random() * filteredDogs.length );
  res.set('Content-Type', 'application/json');
  res.send({ message: filteredDogs[randomNum] });
});


app.post('/createClient', client.createUser);
app.get('/getClients', client.getUsers);
app.post('/getClientById', client.getUser);
app.post('/updateClient', client.updateUser);
app.post('/deleteClient', client.deleteUser);



// DB_USER=PauloVictor
// DB_PASS=Yhz6TmPZD920UFEz
// SECRET=FA8SH8FAH8FA8H8R213FG40G480FQH80FG80HWT435AWE
// Credenciais
const dbUser = 'PauloVictor' || process.env.DB_USER;
const dbPass = 'Yhz6TmPZD920UFEz' || process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.bejkqja.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
    console.log("conectou ao banco!");
  })
  .catch((error: Error) => console.log(error));
