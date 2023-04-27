import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
  .connect(
    'mongodb+srv://serge:R6XXezMn8BeFy5lz@cluster0.9p7ruuj.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'hi',
  });
});

// USER ROUTES
app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// POST ROUTES
app.get('/posts', PostController.getAllPosts);
app.get('/posts/:id', PostController.getPost);
app.delete('/posts/:id', checkAuth, PostController.deletePost);
app.patch('/posts/:id', checkAuth, PostController.updatePost);
app.post('/posts', checkAuth, postCreateValidation, PostController.createPost);

// UPLOAD ROUTE

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server is working');
});
