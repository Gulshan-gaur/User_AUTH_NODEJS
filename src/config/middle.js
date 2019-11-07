import bodyparser from 'body-parser';
import morgan from  'morgan';
//const flash = require('connect-flash');
const  passport = require("passport");
export default app => {
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));
    app.use(morgan('dev'));
    app.use(passport.initialize());
    app.use(passport.session());
    
   // app.use(flash());
};