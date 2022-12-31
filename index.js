import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express';

import mongoose from 'mongoose';

import multer from 'multer';

import cors from 'cors'

import {registerValidation, postCreateValidations, commentsCreateValidations, loginValidation, editUser} from './validations/auth.js';

import chekAuth from './utils/chekAuth.js';

import * as UserControler from './controler/UserControler.js'
import * as PostControler from './controler/PostCpntroler.js'
import * as CommentsControler from './controler/CommentsControler.js'
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
    .connect('mongodb+srv://sasa:sasa@cluster0.x7ezz.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_,__, cb) => {
        cb(null, 'uploads')
    },
    filename: (_,file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage }); 

app.use(express.json());

app.use(cors());

app.post('/upload',  upload.single('image'), (req, res) => {
    res.json ({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserControler.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserControler.register) ;

app.get('/auth/me', chekAuth, UserControler.getMe );
app.get('/user', chekAuth, UserControler.getUser );
app.patch('/auth/me', chekAuth, editUser, handleValidationErrors, UserControler.update );

app.get('/tags',  PostControler.getLastTags);

app.post('/posts', chekAuth, postCreateValidations, handleValidationErrors, PostControler.create);

app.post('/posts/comments', chekAuth, commentsCreateValidations, handleValidationErrors, CommentsControler.createComment);

app.get('/posts',  PostControler.getAll);
app.get('/posts/user',  PostControler.getUserPosts);
app.get('/posts/comments', CommentsControler.getComment);
app.get('/posts/tags',  PostControler.getLastTags);
app.get('/posts/:id',  PostControler.getOne);
app.get('/user/:id',  UserControler.getOne);
app.delete('/posts/:id', chekAuth, PostControler.remove);
app.patch('/posts/:id', chekAuth, postCreateValidations, handleValidationErrors, PostControler.update);

app.listen(2525, (err) => {
    if (err) { 
        return console.log(err);
    }

    console.log('Server Ok')
});