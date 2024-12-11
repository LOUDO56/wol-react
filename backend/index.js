import express from "express";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { exec } from 'child_process';
import ping from 'ping';

dotenv.config({ path: '../.env' });
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
const localIp = '192.18.1.25'

const isAuthorized = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ error: "Unauthorized." });
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.password = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." })
    }
}


app.post('/api/action', isAuthorized, (req, res) => {
    const action = req.body.action;
    let cmd;
    switch (action) {
        case "wake-up":
            cmd = 'wakeonlan ' + process.env.MAC_ADDRESS;
            break;
        case "shutdown":
            cmd = "shutdown -s -f -t 1"
            break;
        case "hibernate":
            cmd = 'shutdown -h'
            break;
    }
    exec(cmd, (err, stdout, stderr) => {
        if(err || stderr) return res.status(400).json({ error: err });
        else {
            return res.status(200);
        }
    });
});

app.get('/api/is-alive', isAuthorized, (req, res) => {
   try {
        ping.sys.probe(localIp, (isAlive) => {
            if(isAlive) return res.status(200).json({ online: true });
            else return res.status(200).json({ online: false });
        })
   } catch (error) {
        return res.status(400).json({ error: error });
   }
})

app.get('/api/is-connected', (req, res) => {
    if(!req.cookies.token) return res.status(200).json({ isConnected: false });
    else return res.status(200).json({ isConnected: true })
})

app.post('/api/login', (req, res) => {
    const password = req.body.password;
    if(!password) return res.status(404).json({ error: "Please, fill a password." });

    if(password === process.env.PASSWORD) {
        const token = jwt.sign({ password: password }, process.env.SECRET, { expiresIn: '30d' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200)
    } else {
        return res.status(403).json({ error: "Wrong password." });
    }

});


app.listen(port, () => {
    console.log('Listening on: http://localhost:' + port)
})

