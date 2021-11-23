'use strict';

//const mongoose = require('mongoose');
//const Customer = mongoose.model('Customer');

const ValidationContract = require('../validators/fluent_validator');
const repository = require('../repositories/customer-repository');

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
        await repository.create(req.body);
        res.status(201).send({message:'Cliente Cadastrado com sucesso'});
    
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}