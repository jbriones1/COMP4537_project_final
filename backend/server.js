'use strict';

const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

dotenv.config();

app.use('*', cors());
app.use(express.json());
app.use('/', require('./routes/authentication'));
app.use('/v1', require('./routes/v1'));

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));