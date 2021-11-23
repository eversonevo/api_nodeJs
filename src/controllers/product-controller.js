'use strict';

//const mongoose = require('mongoose');
//const Product = mongoose.model('Product');

const ValidationContract = require('../validators/fluent_validator');
const repository = require('../repositories/product-repositorie');

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.getBySlug = async(req,res,next) =>{

    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);    
    } catch (error) {      
        res.status(500).send({message:'Falha ao processar informação'});    
    }
    
    
}

/*
exports.getBySlug = (req,res,next) =>{
    
    // traz todos os cadastros com dados escolhidos   active:true traz somente os produtos ativos
    // slug é um cadastro único então usa o findOne para não trazer um array
    Product.findOne({
        slug: req.params.slug,
        active:true},'title description price slug tags').then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
    
}*/

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.getByTag = async(req,res,next) =>{
    
    try {
        var data = await repository.getByTag(req.params.tag);       
        res.status(200).send(data);    
    } catch (error) {
        res.status(500).send({message:'Falha ao processar informação'});    
    }   
    
}


/*exports.getByTag = (req,res,next) =>{
    
    Product.find({
        tags: req.params.tag,
        active:true},'title description price slug tags').then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
    
}*/

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.getById = async(req,res,next) =>{
    
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);     
    } catch (error) {
        res.status(500).send({message:'Falha ao processar informação'});    
    }   
    
}



/*
exports.getById = (req,res,next) =>{
        
    Product.findById(req.params.id).then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
    
}*/

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.get = async(req,res,next) =>{
    
   try {
    var data = await repository.get();
    res.status(200).send(data);
   } catch (error) {
       res.status(500).send({
           message:"Falha ao processar requisição"
       });
   }
   
   /*
    repository.get()
    .then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
    */
    
    /* traz todos os cadastros com todos os dados
    Product.find({}).then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });*/
}



/*MÉTODO DENTRO DO CONTROOLER, ACIMA MÉTODO DIVIDIDO, FICA MAIS ORGANIZADO
exports.get = (req,res,next) =>{
    
    // traz todos os cadastros com dados escolhidos   active:true traz somente os produtos ativos
    Product.find({active:true},'title price slug').then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
    
    
    /* traz todos os cadastros com todos os dados
    Product.find({}).then(data => {
        res.status(200).send(data);
    })
    .catch(e=>{
        res.status(400).send({message:'Erro ao buscar produtos',data:e});
    });
}*/

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.post = async(req,res,next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title,3,'O título deve ter ao menos 3 caracteres');
    contract.hasMinLen(req.body.slug,3,'O slug deve ter ao menos 3 caracteres');
    contract.hasMinLen(req.body.description,3,'A descrição deve ter ao menos 3 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create(req.body);
        res.status(201).send({message:'produto Cadastrado com sucesso'});
    
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }
}

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.put = async(req,res,next) => {
    try {
        await repository.update(req.params.id,req.body);
        res.status(200).send({message: 'Produto Atualizado com sucesso!'});    
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    }   
        
}

/* ---------------------------------------------------------------------------------------------------------------------------*/

exports.delete = async(req,res,next) => {
    
    try {
        await repository.delete(req.body.id);
        res.status(200).send({message: 'Produto removido com sucesso!'});
    } catch (error) {
        res.status(500).send({
            message:"Falha ao processar requisição"
        });
    } 

    
}