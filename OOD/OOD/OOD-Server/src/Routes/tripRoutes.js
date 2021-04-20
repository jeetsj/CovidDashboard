const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const uniqueString = require('unique-string');
const fs = require('file-system');

router.use(requireAuth);

router.get("/record-count", (req, res) => {
    console.log("User", req.user);
    const user = req.user;
    fs.readFile("./assets/tripLogs.json", (err, data) => {
        if(err) {
            console.log("Trip Read Error",err)
        }
        const tLogs = JSON.parse(data);
        const userLogs = tLogs.filter(t => t.u_id === user.id);
        return res.status(200).send({tripCount: userLogs.length});    
    });

});

router.get('/logs', (req, res) => {
    const user = req.user;
    // console.log("dkdkdkdk",user)
    fs.readFile("./assets/tripLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const tripLogs = JSON.parse(data);
        const tLogs = tripLogs.filter(t => t.u_id === user.id);
        // console.log("tlogs", tLogs);
        return res.send(tLogs);
    })
    
});

router.post('/add', (req,res) => {

    console.log(req.body);    
    const user = req.user;
    const tLog = {
        id: uniqueString(),
        u_id: user.id,
        sname: req.body.sname,
        date: req.body.date,
        time: req.body.time,
        cdetail: req.body.cdetail,
        summary: req.body.summary
    }
    fs.readFile("./assets/tripLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const tripLogs = JSON.parse(data);
        tripLogs.push(tLog);
        fs.writeFile("./assets/tripLogs.json", JSON.stringify(tripLogs, null, 2) ,(err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err);
            }
            const tLogsUpdated = tripLogs.filter(t => t.u_id === user.id)
            return res.send(tLogsUpdated);
        })
    })
});

router.post('/delete', (req,res) => {

        console.log(req.body);
        const logId = req.body.id;
        fs.readFile("./assets/tripLogs.json", (err, data) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err);
            }
            const tripLogs = JSON.parse(data);
            const updatedTLogs = tripLogs.filter(t => t.id !== logId);
            fs.writeFile("./assets/tripLogs.json", JSON.stringify(updatedTLogs, null, 2)  ,(err) => {
                if (err) {
                    console.log(err);
                    return res.status(422).send(err);
                }
                const userTLogs = updatedTLogs.filter(t => t.u_id === req.user.id)
                return res.status(200).send();
            })
        })
});

router.get('/editid/:id', (req,res) => {
    const id = req.params.id;
    fs.readFile("./assets/tripLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const tripLogs = JSON.parse(data)
        const updatedTLogs = tripLogs.filter(t => t.id === id);
        console.log(updatedTLogs)

        return res.send(updatedTLogs[0]);
    })

})

router.post('/edit', (req, res) => {

    console.log("DKDKDKDk",req.body);
    const logId = req.body.id;
    fs.readFile("./assets/tripLogs.json", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(422).send(err);
        }
        const tripLogs = JSON.parse(data);
        const updatedTLogs = tripLogs.filter(t => t.id !== logId);
        const editedLog = {
            id: logId,
            u_id: req.user.id,
            sname: req.body.sname,
            date: req.body.date,
            time: req.body.time,
            cdetail: req.body.cdetail,
            summary: req.body.summary
        }
        updatedTLogs.push(editedLog);
        fs.writeFile("./assets/tripLogs.json", JSON.stringify(updatedTLogs, null, 2), (err) => {
            if (err) {
                console.log(err);
                return res.status(422).send(err); 
            }
            const userTLogs = updatedTLogs.filter(t => t.u_id === req.user.id)
            console.log("userTLOGS", userTLogs);
            return res.status(200).send(userTLogs);
        });
    });
});

module.exports = router;