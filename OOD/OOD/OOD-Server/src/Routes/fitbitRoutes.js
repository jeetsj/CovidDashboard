const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const fs = require('file-system');

router.use(requireAuth);

router.get('/', (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/fitbitData.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const fitbitData = JSON.parse(data);
        const fLogs = fitbitData.filter(f => f.u_id === user.id)
        res.send(fLogs);
    })
    
});

module.exports = router;