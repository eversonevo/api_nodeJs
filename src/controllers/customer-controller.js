'use strict';

//const mongoose = require('mongoose');
//const Customer = mongoose.model('Customer');

const ValidationContract = require('../validators/fluent_validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

const emailService = require('../services/email_service');
const authService = require('../services/auth_service');

exports.post = async(req,res,next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name,3,'O nome deve ter ao menos 3 caracteres');
    contract.isEmail(req.body.email,'E-mail inválido');
    contract.hasMinLen(req.body.password,6,'A senha deve ter ao menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {

        

        await repository.create({
            name:req.body.name,
            email: req.body.email,
            password:md5(req.body.password+global.SALF_KEY),
            roles:["user"]
        });

        emailService.send(req.body.email,'Bem vindo',global.EMAIL_TMPL.replace('{0},req.body.name'));
        res.status(201).send({message:'Cliente Cadastrado com sucesso'});
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}

exports.authenticate = async(req,res,next) => {
 
 /*  IMPORTANTE DEIXAR  PARA VALIDAR CAMPOS
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name,3,'O nome deve ter ao menos 3 caracteres');
    contract.isEmail(req.body.email,'E-mail inválido');
    contract.hasMinLen(req.body.password,6,'A senha deve ter ao menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
*/
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password:md5(req.body.password+global.SALF_KEY)
        });

        console.log(customer.password);
        console.log(customer.email);
        console.log(customer.name);

        if (!customer){
            res.status(404).send({
                message:"Usuário ou senha inválidos"
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });

        
        res.status(201).send({
            token: token,
            data:{
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}


// refresh token,quando for vencer   gera um novo
exports.refreshToken = async(req,res,next) => {
 
    

       try {

            // recupera token
            const token = req.body.token  || req.query.token || req.headers['x-access-token'];
                    
            //decodifica token
            const data = await authService.decodeToken(token);

           const customer = await repository.getById(data.id);
   
           console.log(customer.password);
           console.log(customer.email);
           console.log(customer.name);
   
           if (!customer){
               res.status(404).send({
                   message:"Cliente não encontrado"
               });
               return;
           }
   
           const tokenData = await authService.generateToken({
               id: customer._id,
               email: customer.email, 
               name: customer.name,
               roles: customer.roles});
   
           
           res.status(201).send({
               token: token,
               data:{
                   email: customer.email,
                   name: customer.name
               }
           });
       } catch (error) {
           res.status(500).send({
               message:"Falha ao processar requisição"
           });
       }
   }