const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const uniqueString = require('unique-string');
const fs = require('file-system');

router.use(requireAuth);

router.get("/record-count", (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/symptomsLogs.json", (err, data) => {
        if(err) {
            console.log("Symptoms Read Error",err)
        }
        const sLogs = JSON.parse(data);
        const userLogs = sLogs.filter(s => s.u_id === user.id);
        return res.status(200).send({symptomsCount: userLogs.length});    
    });
});

router.get('/logs', (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/symptomsLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const symptomsLogs = JSON.parse(data);
        const sLogs = symptomsLogs.filter(s => s.u_id === user.id)
        res.send(sLogs);
    })
    
});

router.post('/add', (req,res) => {
    console.log(req.body);
    const user = req.user;
    const sLog = {
        id: uniqueString(),
        u_id: user.id,
        sname: req.body.sname,
        date: req.body.date,
        time: req.body.time,
        summary: req.body.summary,
        severity: req.body.severity
    }
    fs.readFile("./assets/symptomsLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const symptomsLogs = JSON.parse(data);
        symptomsLogs.push(sLog);
        fs.writeFile("./assets/symptomsLogs.json", JSON.stringify(symptomsLogs, null, 2) ,(err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err);
            }
            const sLogsUpdated = symptomsLogs.filter(s => s.u_id === user.id)
            // console.log("File Write", dLogsUpdated);
            return res.send(sLogsUpdated);
        })
    })
});

router.post('/delete', (req,res) => {
        console.log(req.body);
        const logId = req.body.id;
        fs.readFile("./assets/symptomsLogs.json", (err, data) => {
            if (err) {
                console.log(err);
                res.status(422).send(err);
            }
            const symptomsLogs = JSON.parse(data);
            const updatedSLogs = symptomsLogs.filter(s => s.id !== logId);
            fs.writeFile("./assets/symptomsLogs.json", JSON.stringify(updatedSLogs, null, 2)  ,(err) => {
                if (err) {
                    console.log(err);
                    return res.status(422).send(err);
                }
                const userSLogs = updatedSLogs.filter(s => s.u_id === req.user.id)
                return res.status(200).send(userSLogs);
            })
        })
});

router.get('/editid/:id', (req,res) => {
    const id = req.params.id;
    fs.readFile("./assets/symptomsLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const symptomsLogs = JSON.parse(data)
        const updatedSLogs = symptomsLogs.filter(s => s.id === id);
        return res.send(updatedSLogs[0]);
    })

})

router.post('/edit', (req, res) => {

    console.log(req.body);
    const logId = req.body.id;
    fs.readFile("./assets/symptomsLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const symptomsLogs = JSON.parse(data);
        const updatedSLogs = symptomsLogs.filter(s => s.id !== logId);
        const editedLog = {
            id: logId,
            u_id: req.user.id,
            sname: req.body.sname,
            date: req.body.date,
            time: req.body.time,
            summary: req.body.summary,
            severity:req.body.severity
        }
        updatedSLogs.push(editedLog);
        fs.writeFile("./assets/symptomsLogs.json", JSON.stringify(updatedSLogs, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err); 
            }
            const userSLogs = updatedSLogs.filter(s => s.u_id === req.user.id)
            return res.status(200).send(userSLogs);
        });
    });
});

module.exports = router;