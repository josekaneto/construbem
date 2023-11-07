const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/construbem',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const UsuarioSchema =  new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : String}
})

const Usuario = mongoose.model("Usuario", UsuarioSchema)

app.post("/cadastrousuario", async(req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    if( email == '' || senha == ''){
        return res.status(400).json({error : "Preencha todos os campos coretamente"})
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste){
        return res.status(400).json({error : "o Email cadastrado ja existe. Por favor insira um não cadastrado"})
    }

    const usuario = new Usuario({
        email : email,
        senha : senha
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error: null, msg : "Cadastro ok", pessoaId : newUsuario._id})
    }
    catch(error){
        res.status(400).json({error})
    }

})


const ProdutoConstrucaoSchema =  new mongoose.Schema({
    id_produtoconstrucao : {type : String, required : true},
    descricao : {type : String},
    fornecedor : {type : String},
    dataFabricacao : {type : String},
    quantidadeEstoque : {type : Number}
})

const ProdutosConstrucao = mongoose.model("ProdutosConstrucao", ProdutoConstrucaoSchema)


app.post("/cadastroprodutoconstrucao", async(req, res) => {
    id_produtoconstrucao  = req.body.id_produtoconstrucao,
    descricao = req.body.descricao,
    fornecedor = req.body.fornecedor,
    dataFabricacao = req.body.dataFabricacao,
    quantidadeEstoque = req.body.quantidadeEstoque

    if( id_produtoconstrucao == '' || descricao == '' ||fornecedor == '' || dataFabricacao == '' || quantidadeEstoque == ''){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const idExiste = await ProdutosConstrucao.findOne({id_produtoconstrucao:id_produtoconstrucao})

    if(idExiste){
        return res.status(400).json({error : "o ID cadastrado ja existe. Por favor insira um não cadastrado"})
    }

    const quantidadeEstoqueLimite = quantidadeEstoque

    if(quantidadeEstoqueLimite > 20){
        return res.status(400).json({error : "O limite de estoque foi atingido (20)"})
    }
    else if(quantidadeEstoqueLimite <= 0 ){
        return res.status(400).json({error : "colocar um valor positivo menor que 20"})
    }

    const produto = new ProdutosConstrucao({
        id_produtoconstrucao  : id_produtoconstrucao,
        descricao : descricao,
        fornecedor :fornecedor,
        dataFabricacao : dataFabricacao,
        quantidadeEstoque : quantidadeEstoque
    })

    try{
        const newProduto = await produto.save()
        res.json({error: null, msg : "Cadastro ok", produtoId : newProduto._id})
    }
    catch(error){
        res.status(400).json({error})
    }

})


app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname + "/cadastrousuario.html")
})

app.get("/cadastroprodutoconstrucao", async(req, res)=>{
    res.sendFile(__dirname + "/cadastroprodutoconstrucao.html")
})

app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})