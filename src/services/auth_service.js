'use strict';

const jwt = require('jsonwebtoken');

exports.generateToken = async(data)=>{
    console.log("aquiii");
    return jwt.sign(data,global.SALF_KEY,{expiresIn: '5d'});  // 5dia  tempo de expiração do token
}

exports.decodeToken = async(token)=>{
    var data = await jwt.verify(token,global.SALF_KEY);
    return data;
}

exports.authorize = function(req,res,next){
    var token = req.body.token  || req.query.token || req.headers['x-access-token'];
    console.log("token + "+token);

    if (!token){
        res.status(401).json({
            message:"Acesso Restrito"
        });
    }else{
        jwt.verify(token,global.SALF_KEY, function(error,decoded){

            if(error){
                console.log(error);
                res.status(401).json({
                    message:"Acesso inválido"
                });
            }else{
                next();
            }
        })
    }
}

exports.isAdmin = function(req,res,next){
    var token = req.body.token  || req.query.token || req.headers['x-access-token'];

    if (!token){
        res.status(401).json({
            message:"Acesso Restrito"
        });
    }else{
        jwt.verify(token,global.SALF_KEY, function(error,decoded){

            if(error){
                console.log(error);
                res.status(401).json({
                    message:"Acesso inválido"
                });
            }else{
                // se for administrador
                if (decoded.roles.includes("admin")){
                    next();
                }else{
                    res.status(403).json({
                        message:"Esta funcionalidade é restrita para administradores"
                    });
                }
            }
        })
    }
}