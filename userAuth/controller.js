const { genToken } = require("../Helper");
const db = require("../dbConnection");
const bcrypt = require("bcryptjs");

const notValid = (email) => {
    return new Promise((resolve, reject) => {

        db.query('select * from users where email = ?', [email.toLowerCase()], (err, result)=>{
            if (result.length)
            resolve(true);
            else
            resolve(false);
        })
    })

}
class Controller {


     async signup(req, res) {
        try{

            let {email, password, firstname, lastname} = req.body;
    
            if (await notValid(email)){
                return res.status(200).send({
                    success: false,
                    message: "Email is already registered"
                })
            }
    
            email = email.toLowerCase();
            password = await bcrypt.hash(password, 8);
    
            db.query('INSERT INTO users (email, password, firstname, lastname) VALUES (?,?,?,?)',[email, password,firstname, lastname], (err, result) => {
                if (err){
                    console.log(err,"**********error");
                    return res.status(200).send({
                        success: false,
                        message: err
                    })
                }
                return res.status(201).send({
                    success: true,
                    message: "User created successfully."
                })
            })
        }catch(error){
            console.log(error,"************Error")
        }
    
    }
 
    async login (req,res) {
        let { email, password } = req.body;
        db.query('select * from users where email = ?',[email], async (error, result) =>{
            
            if (!result.length)
            return res.send({
                success: false,
                message: "Credentials not found"
            })

            let token;
            if (await bcrypt.compare(password, result[0].password))
            token = await genToken({...req.body, id: result[0].id});

            res.status(201).send({
                success: true,
                token
            })
        })

    }

}

module.exports = new Controller();