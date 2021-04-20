const jwt = require('jsonwebtoken');
const users = require('../../assets/users.json');

module.exports = (req,res,next) => {
    const { authorization } = req.headers;

    if(!authorization){
        res.status(401).send({error: "You must be logged in."});
    }

    const token = authorization.replace("Bearer ", '');
    // console.log(token);
    jwt.verify(token, "My_Secret_Key", async (err, payload) => {
        if(err){
            return res.status(401).send({error: "You must be logged in."});
        }
        const { userId } = payload;
        // console.log("User ID JWT Payload", userId);
        const user = users.filter(u => u.id === userId);
        req.user = user[0];
        next();
    });

}