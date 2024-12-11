import express from "express";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config({ path: '../.env' });
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

const isAuthorized = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ error: "Unauthorized." });
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.password = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." })
    }
}


app.get('/wake-up', isAuthorized, (req, res) => {
    
});

app.post('/login', (req, res) => {
    const password = req.body.password;
    console.log(req.body);
    if(!password) return res.status(404).json({ error: "Please, fill a password." });

    console.log(password)
    console.log(process.env.PASSWORD)
    if(password === process.env.PASSWORD) {
        const token = jwt.sign({ password: password }, process.env.SECRET, { expiresIn: '30d' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200)
    } else {
        res.status(403).json({ error: "Wrong password." });
    }

});


app.listen(port, () => {
    console.log('Listening on: http://localhost:' + port)
})

