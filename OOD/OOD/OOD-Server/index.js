const express = require('express');
const bodyParser = require('body-parser').json();
const cors = require('cors');
const doctorRouter = require('./src/Routes/doctorRoutes');
const tripRouter = require('./src/Routes/tripRoutes');
const fitbitRouter = require('./src/Routes/fitbitRoutes');
const userRouter = require('./src/Routes/userRoutes');
const symptomsRouter = require('./src/Routes/symptomsRoutes');

const app = express();

app.use(cors());
app.use(bodyParser);

app.use('/user', userRouter);
app.use('/doctor', doctorRouter);
app.use('/trip', tripRouter);
app.use('/fitbit', fitbitRouter);
app.use('/symptoms', symptomsRouter);

// app.get('/', (req, res) => {
//     res.send("Hello")
// })

app.listen(3000, () => {
    console.log('OOD Project Server Listening on 3000');
});