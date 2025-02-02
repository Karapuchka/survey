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
    database: 'survay',
});

//Создание парсера
const urlcodedParsers = express.urlencoded({extended: false});

//JSON парсер
const JSONParser = express.json();

//Указание пути к файлом hbs
app.use(express.static(path.join(fs.realpathSync('.') + '/public')));
app.set('view engine', 'hbs');

app.get('/', (_, res)=>{
    return res.render('index.hbs');
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


app.get('/home', (_, res)=>{

    pool.query('SELECT * FROM surveys', (err, data)=>{
        if(err) return console.log(err);

        let arrSurvey = [];

        for (let j = 0; j < data.length; j++) {
            let arrIdUsers = data[j].idUsersCompleted.split(',');
            let valid = false;

            for (let i = 0; i < arrIdUsers.length; i++) {
                if(+arrIdUsers[i] == user.id){
                    arrSurvey.push({
                        'id': data[j].id,
                        'title': data[j].title,
                        'status': 'green',
                        'statusText': 'Пройден',
                    });

                    valid = true;

                    break;
                }            
            }  

            if(!valid){
                arrSurvey.push({
                    'id': data[j].id,
                    'title': data[j].title,
                    'status': 'red',
                    'statusText': 'Не пройден',
                });
            }
        }

        res.render('home.hbs',{
            'list': arrSurvey,
        });
    });
});

app.post('/open-survey', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.statusCode(400);

    pool.query('SELECT * FROM questions', (err, data)=>{
        if(err) return console.log(err);

        let questionsList = [];

        for (let i = 0; i < data.length; i++) {

            if(data[i].idSurvey == req.body.id){
             
                let answersList = data[i].answer.split(',');
                
                questionsList.push({
                    'title': data[i].title,
                    'answers': answersList,
                    'id': data[i].id,
                });
            };      
        };    

        res.render('survey.hbs', {
            'titleSurvay': req.body.title,
            'questionsList': questionsList,
        });
    });
});

app.post('/completed-survey', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.statusCode(400);

    pool.query('SELECT * FROM questions', (err, data)=>{
        if(err) return console.log(err);

        let countTrueAnswer = 0;
        let countAnswer = 0;

        for (const key in req.body) {
            for (let i = 0; i < data.length; i++) {
                if(data[i].title == key){
                    countAnswer++;

                    if(data[i].curAnswer == req.body[key]){
                        countTrueAnswer++;
                    };
                };
            };
        };

        let result = 100 * countTrueAnswer / countAnswer;

        let upRes = 0;

        if(result == 100) upRes = 100;
        else if (result <= 80) upRes = 80;
        else if (result <= 50) upRes = 50;
        else if (result <= 30) upRes = 30;
        else if (result == 0) upRes = 0;

        pool.query(`UPDATE surveys SET ?=? WHERE title=?`, [String(upRes), String(result), req.body.titleSurvay], (errSurveys)=> {if(errSurveys) return console.log(errSurveys)});
                  
        pool.query('SELECT * FROM surveys', (err, data)=>{
        if(err) return console.log(err);

        let arrSurvey = [];

        for (let j = 0; j < data.length; j++) {
            let arrIdUsers = data[j].idUsersCompleted.split(',');
            let valid = false;

            for (let i = 0; i < arrIdUsers.length; i++) {
                if(+arrIdUsers[i] == user.id){
                    arrSurvey.push({
                        'id': data[j].id,
                        'title': data[j].title,
                        'status': 'green',
                        'statusText': 'Пройден',
                    });

                    valid = true;

                    break;
                };           
            };  

            if(!valid){
                arrSurvey.push({
                    'id': data[j].id,
                    'title': data[j].title,
                    'status': 'red',
                    'statusText': 'Не пройден',
                });
            };
        };

        res.render('home.hbs',{
            'list': arrSurvey,
        });
    });

        res.render('home.hbs');
    });
});

app.get('/profile', (_, res)=>{
    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        let userLogin;
        
        for (let i = 0; i < data.length; i++) {
            if(data[i].id == user.id){
                userLogin = data[i].login;
            };           
        };

        pool.query('SELECT * FROM surveys', (errSurvey, dataSurvey)=>{
            if(errSurvey) return console.log(errSurvey);

            let userSurvey = {
                '100': 0,
                '80': 0,
                '50': 0,
                '30': 0,
                '0': 0,
            }
            
            for (let i = 0; i < dataSurvey.length; i++) {
                userSurvey['100'] += dataSurvey[i]['100'];
                userSurvey['80'] += dataSurvey[i]['80'];
                userSurvey['50'] += dataSurvey[i]['50'];
                userSurvey['30'] += dataSurvey[i]['30'];
                userSurvey['0'] += dataSurvey[i]['0'];
            }

            return res.render('profile.hbs', {
                'userLogin': userLogin,
                '100': userSurvey['100'],
                '80': userSurvey['80'],
                '50': userSurvey['50'],
                '30': userSurvey['30'],
                '0': userSurvey['0'],
            });
        });
    });
});

app.listen(3000, ()=>{
    return console.log('Server ative. URL: http://localhost:3000/');
});