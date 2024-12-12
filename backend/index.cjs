const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const { exec } = require('child_process');
const ping = require('ping');

dotenv.config({ path: '.env' });
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
const localIp = '192.168.0.233'

const isAuthorized = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ error: "Unauthorized." });
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.password = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token." })
    }
}


app.post('/api/raspb/action', isAuthorized, (req, res) => {
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
        if(err || stderr) return res.status(400).json({ error: JSON.stringify(err) });
        else {
            return res.sendStatus(200)
        }
    });
});

app.post('/api/pc/action', isAuthorized, (req, res) => {
    const action = req.body.action;
    let cmd;
    switch (action) {
        case "shutdown":
            cmd = "shutdown -s -f -t 1"
            break;
        case "hibernate":
            cmd = 'shutdown -h'
            break;
    }
    exec(cmd, (err, stdout, stderr) => {
        if(err || stderr) return res.status(400).json({ error: JSON.stringify(err) });
        else {
            return res.sendStatus(200)
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


app.post('/api/login', (req, res) => {
    const password = req.body.password;
    if(!password) return res.status(404).json({ error: "Please, fill a password." });
    if(password === process.env.PASSWORD) {
        const token = jwt.sign({ password: password }, process.env.SECRET, { expiresIn: '30d' });
        res.cookie('token', token, {
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ status: "Login successfull!" });
    } else {
        return res.status(403).json({ error: "Wrong password." });
    }

});


app.listen(port, () => {
    console.log('Listening on: http://localhost:' + port)
})

