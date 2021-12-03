'use strict';

//const mongoose = require('mongoose');
//const Customer = mongoose.model('Customer');

const ValidationContract = require('../validators/fluent_validator');
const repository = require('../repositories/order-repository');
const authService = require('../services/auth_service');


const guid = require('guid');

exports.post = async(req,res,next) => {

    /*
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name,3,'O nome deve ter ao menos 3 caracteres');
    contract.isEmail(req.body.email,'E-mail inválido');
    contract.hasMinLen(req.body.password,6,'A senha deve ter ao menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }*/


    try {

        // recupera token
        const token = req.body.token  || req.query.token || req.headers['x-access-token'];
        
        //decodifica token
        const data = await authService.decodeToken(token);
        console.log("data "+data);

        await repository.create({
            customer:data.id,
            number: guid.raw().substring(0,6),
            items: req.body.items
        });
        res.status(201).send({message:'Pedido Cadastrado com sucesso'});
    
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}

exports.get = async(req,res,next) =>{
    
    try {
     var data = await repository.get();
     res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}