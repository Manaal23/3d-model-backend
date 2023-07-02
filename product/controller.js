const { storagePath } = require("../constants");
const db = require("../dbConnection");
const fs = require('fs');

const generateUniqueFilename = (originalFilename) => {
   const timestamp = Date.now();
   const randomString = Math.random().toString(36).substring(2, 8);
   const extension = originalFilename.split('.').pop();
   const uniqueFilename = `${timestamp}_${randomString}.${extension}`;
 
   return uniqueFilename;
 }

class Controller {

    async createModel(req, res) {
        try{
            
                    const { modelId ,name, description, features, price, glbmodel } = req.body;
                    const userId = req.userId;
            
                    if (!modelId)
                    db.query('INSERT INTO model_details (name, description, features, price, glb_model, uid) VALUES (?,?,?,?,?, ?)',[name, description, features, price, glbmodel, userId], (err, result) => {
                        if (err){
                            return res.status(200).send({
                                success: false,
                                data: err
                            })
                        }
            
                        return res.status(201).send({
                            success: true,
                            message: 'Model created successfully'
                        })
                    })
            
                    else{
                        db.query('UPDATE model_details SET name=?, description=?, features=?, price=?, glb_model=? WHERE id = ? and uid=?',[name, description, features, +price, glbmodel, modelId, userId], (err, result) => {
                            if (err){
                                return res.status(200).send({
                                    success: false,
                                    data: err
                                })
                            }
                
                            return res.status(201).send({
                                success: true,
                                message: 'Model created successfully'
                            })
                        })
                    }

        }catch(err){
            console.log(err,"**************CREATING")
        }
        
    }

    async deleteModel(req,res) {
        const userId = req.userId;
        const modelId = req.params.id;
        db.query(`Delete from model_details where id=? and uid=?`, [modelId, userId], (err, result) =>{

            if (err)
            return res.status(200).send({
                success:false,
                message: err
            })

            return res.status(201).send({
                success:true,
                message: "Deleted successfully"
            })
        })
    }

    async getModels(req,res){
        try{

            const limit = 10;
            const page = req.query.page || 1;
            const modelId = req.params.id;
            const offset = (page-1) * limit;
            const userId = req.userId;
        
        
                db.query(`select *,model_details.id as modelId, (${userId ? `model.filename` : `model.path`}) as glb_data from model_details
                left join glb_model model on 
                model_details.glb_model=model.id
                ${userId ? `where uid= ${userId}` : ''} ${userId && modelId
                    ?`and model_details.id = ${modelId}` 
                    : modelId 
                        ? `where model_details.id = ${modelId}`
                        : ``} 
                    limit ${offset},${limit}`, (err, result) => {
        
                    console.log(err,"*********ERROR")
        
                    if (err)
                    return res.status(200).send({
                        success: false,
                        message: err
                    })
        
                    return res.status(201).send({
                        success: true,
                        data: result
                    })
                })
        }catch(err){
            console.log(err,"*************ERROR")
        }


}


    async uploadGlb(req,res){
        const { originalname, buffer } = req.file;

        const uniqueName = generateUniqueFilename(originalname);
        fs.writeFileSync(`3d_models/${uniqueName}`, buffer);
        
        db.query('INSERT INTO glb_model (filename, path) VALUES (?, ?)', [uniqueName, `${storagePath}/${uniqueName}`], (err, result)=>{
            if (err){
                console.log(err,"((((((((((((((( ERROR")

                return res.status(200).send({
                    success: false,
                    message: err
                })
            }

            return res.status(201).send({
                success: true,
                data: result
            })
        })

    }


}

module.exports = new Controller();