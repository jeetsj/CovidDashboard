const express = require('express');
// const doctorLogs = require('../../assets/doctorVisits.json');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const uniqueString = require('unique-string');
const fs = require('file-system');

router.use(requireAuth);

router.get("/record-count", (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/doctorVisits.json", (err, data) => {
        if(err) {
            console.log("Doctor Read Error",err)
        }
        const doctorLogs = JSON.parse(data);
        const userLogs = doctorLogs.filter(d => d.u_id === user.id);
        return res.status(200).send({doctorCount: userLogs.length});    
    });
});

router.get('/logs', (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/doctorVisits.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const doctorLogs = JSON.parse(data);
        const dLogs = doctorLogs.filter(d => d.u_id === user.id)
        res.send(dLogs);
    })
    
});

router.post('/add', (req,res) => {
    console.log(req.body);
    const user = req.user;
    const dLog = {
        id: uniqueString(),
        u_id: user.id,
        sname: req.body.sname,
        date: req.body.date,
        time: req.body.time,
        summary: req.body.summary
 
    }
    fs.readFile("./assets/doctorVisits.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        // console.log("File Read", JSON.parse(data));
        const doctorLogs = JSON.parse(data);
        doctorLogs.push(dLog);
        // console.log("LOg added JSON", doctorLogs);
        fs.writeFile("./assets/doctorVisits.json", JSON.stringify(doctorLogs, null, 2) ,(err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err);
            }
            const dLogsUpdated = doctorLogs.filter(d => d.u_id === user.id)
            // console.log("File Write", dLogsUpdated);
            return res.send(dLogsUpdated);
        })
    })
});

router.post('/delete', (req,res) => {
        console.log(req.body);
        const logId = req.body.id;
        fs.readFile("./assets/doctorVisits.json", (err, data) => {
            if (err) {
                console.log(err);
                res.status(422).send(err);
            }
            const doctorLogs = JSON.parse(data);
            const updatedDLogs = doctorLogs.filter(d => d.id !== logId);
            fs.writeFile("./assets/doctorVisits.json", JSON.stringify(updatedDLogs, null, 2)  ,(err) => {
                if (err) {
                    console.log(err);
                    return res.status(422).send(err);
                }
                const userLogs = updatedDLogs.filter(d => d.u_id === req.user.id)
                return res.status(200).send(userLogs);
            })
        })
});

router.get('/editid/:id', (req,res) => {
    const id = req.params.id;
    fs.readFile("./assets/doctorVisits.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const doctorLogs = JSON.parse(data)
        const updatedDLogs = doctorLogs.filter(d => d.id === id);
        return res.send(updatedDLogs[0]);
    })

})

router.post('/edit', (req, res) => {

    console.log(req.body);
    const logId = req.body.id;
    fs.readFile("./assets/doctorVisits.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(422).send(err);
        }
        const doctorLogs = JSON.parse(data);
        const updatedDLogs = doctorLogs.filter(d => d.id !== logId);
        const editedLog = {
            id: logId,
            u_id: req.user.id,
            sname: req.body.sname,
            date: req.body.date,
            time: req.body.time,
            summary: req.body.summary
        }
        updatedDLogs.push(editedLog);
        fs.writeFile("./assets/doctorVisits.json", JSON.stringify(updatedDLogs, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err); 
            }
            const userLogs = updatedDLogs.filter(d => d.u_id === req.user.id)
            return res.status(200).send(userLogs);
        });
    });
});

module.exports = router;