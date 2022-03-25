const passwordValidator = require('password-validator');


const schemaPass = new passwordValidator();


schemaPass
.is().min(8)
.is().max(40)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);


module.exports = (req, res, next) => {
    if(schemaPass.validate(req.body.password)){
    next();
    }else{
        res.status(400).json({error : `Le mot de passe n'est pas assez fort ${schemaPass.validate('req.body.password ', {list :true})}`})
    }
}
