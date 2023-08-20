if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express')
const app= express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const Document = require('./models/document')

app.get('/', (req,res)=>{
    // res.send("Hi")
    const code =`Welcome to ShareBin!  

Use the commands in the top right corner 
to create a new file to share others.`
    res.render('code-display',{code , language: "plaintext"})
})

app.get('/new', (req,res)=>{
    res.render('new')
})

app.post('/save', async (req,res)=>{
    const value= req.body.value
    // console.log(value)
    try{
        const document= await Document.create({value});
        res.redirect(`/${document.id}`)
    }catch(e){
        res.render('new', {value})
    }
})
app.get('/:id/duplicate', async(req,res)=>{
    const id= req.params.id;
    try{
        const document= await Document.findById(id);

        res.render('new',{value : document.value })
    }catch(e){
        res.redirect(`/${id}`)
    }
})

app.get('/:id' , async (req,res)=>{
    const id= req.params.id;
    try{
        const document= await Document.findById(id);

        res.render('code-display',{code: document.value , id})
    }catch(e){
        res.redirect('/')
    }
})



app.listen(process.env.PORT || 3000)