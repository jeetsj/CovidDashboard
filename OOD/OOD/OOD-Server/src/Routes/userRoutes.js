const express = require('express');
const uniqueString = require('unique-string');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs  = require('file-system');

router.post('/', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    fs.readFile("./assets/users.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const users = JSON.parse(data);
        const user = users.filter(u => u.email === email);
        console.log("User", user);
        if (user.length === 0) {
            const u = {
                id: uniqueString(),
                email: email,
                password: password
            }
            users.push(u);
            fs.writeFile("./assets/users.json", JSON.stringify(users, null, 2) ,(err) => {
                if (err) {
                    console.log(err);
                    return res.status(422).send(err);
                }
                const userAdded = users.filter(user => user.id === u.id)
                const token = jwt.sign({userId: userAdded[0].id}, 'My_Secret_Key');
                return res.send({token});
            })
        }
        else {
            console.log("existing user", user);
            if (password === user[0].password) {
                const token = jwt.sign({userId:user[0].id}, "My_Secret_Key");
                return res.send({token});
            } else {
                res.send("Authentication Failed");
            }
            
        }
    })
});

module.exports = router;