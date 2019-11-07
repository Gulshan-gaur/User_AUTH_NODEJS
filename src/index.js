import express from 'express';
import dbconfig from './config/db';
import middle from './config/middle';


const passport =  require('passport');

const app = express()
require('./config/passport')(passport);
dbconfig();

middle(app);

const  routes =   require('./routes/route')(passport);
app.use('/api',routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
    if (err) {
        console.error(err);
    }{
        console.log(`App listen to port: ${PORT}`);
    }
});

module.exports = app;