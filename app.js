import express, { query } from 'express';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import multer from 'multer';

const app = express();

let user; //Инфомрация о пользователе

//Настройка подключения к бд
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 3000,
    user: 'root',
    database: 'taskManager',
});

//Создание парсера
const urlcodedParsers = express.urlencoded({extended: false});

//JSON парсер
const JSONParser = express.json();

//Указание пути к файлом hbs
app.use(express.static(path.join(fs.realpathSync('.') + '/public')));
app.set('view engine', 'hbs');

//Настройка работы с файлами пользователя
const storageFile = multer.diskStorage({
    destination: (req, file, cd)=>{
        cd(null, 'public/img/profile');
    },
    filename: (req, file, cd)=>{
        cd(null, file.originalname);
    },
});

const upload = multer({storage: storageFile});

app.get('/', (_, res)=>{
    return res.render('index.hbs');
});

app.get('/singOut', (_, res)=>{
    return res.render('singOut.hbs');
});

app.post('/singIn', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.statusCode(400);

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {

            if(data[i].login == req.body.login && data[i].password == req.body.password){
                user = {
                    'id': data[i].id,
                    'login': data[i].login,
                    'name': data[i].name,
                };
                return res.redirect('/home');
            }
            else if(data[i].login == req.body.login && data[i].password != req.body.password){
                return res.render('index.hbs', {
                    title: 'Пароль введён неправильно!',
                });
            }            
        }

        return res.render('index.hbs', {
            title: 'Пользователь не найден!',
        });
    })
});

app.post('/addUser', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].login == req.body.login){
                return res.render('singOut.hbs', {
                    title: 'Логин занят!',
                });
            }            
        }

        pool.query('INSERT INTO users (login, password, name) VALUES(?,?,?)', [req.body.login, req.body.password, req.body.name], (err)=>{
            if(err) return console.log(err);
        });
    
        res.redirect('/');
    })
});

app.get('/home', (_, res)=>{

    pool.query('SELECT * FROM target', (err, data)=>{
        if(err) return console.log(err);

        let tasks = [];
        
        for (let i = 0; i < data.length; i++) {

            if(user.id == data[i].idUser){
                tasks.push({
                    'id': data[i].id,
                    'title': data[i].title,
                    'time': data[i].time,
                });
            };
        };

        res.render('home.hbs', {
            'tasks': tasks,
        })
    });
});

app.post('/adding-task', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    
    pool.query('INSERT INTO target (title, time, idUser) VALUES (?,?,?,?)', 
    [req.body.title, req.body.time, user.id], (err, data)=>{
        if(err) return console.log(err);
    });

    return res.send('Задача добавлена!');
});

app.post('/del-task', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('DELETE FROM target WHERE id=?', [+req.body.id], (err)=> {if(err) return console.log(err)});

    return res.send('Задача удалена!');
});

app.post('/up-task', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM target', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == req.body.id){

                if(req.body.title == '' && req.body.time == ''){

                    return res.send('Поля для пустые. Задача не изменена!');

                } else if(req.body.title != '' && req.body.time != ''){

                    pool.query('UPDATE target SET title=? time=? WHERE id=?', [req.body.title, req.body.time, req.body.id], (err)=> {if(err) return console.log(err)});

                    return res.send('Заголовок и время задачи изменены!');

                }  else if(req.body.title != '' && req.body.time == ''){

                    pool.query('UPDATE target SET title=? WHERE id=?', [req.body.title, req.body.id], (err)=> {if(err) return console.log(err)});
                    
                    return res.send('Заголовок задачи изменен!');

                } else if(req.body.time != '' && req.body.title == ''){
                    
                    pool.query('UPDATE target SET time=? WHERE id=?', [req.body.time, req.body.id], (err)=> {if(err) return console.log(err)});
                    
                    return res.send('Время задачи изменено!');

                };
            };         
        };
    });
});

app.listen(3000, ()=>{
    return console.log('Server ative. URL: http://localhost:3000/');
});