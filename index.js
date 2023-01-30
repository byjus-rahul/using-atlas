const {ObjectId}=require('mongodb')
let express = require('express')
let {connectToDb , getDb} = require('./db')

let app = express();
app.use(express.json())
let db;

connectToDb((err)=>{
    if(!err){
        app.listen(8000,()=>{
            console.log("Listening to port 8000...")
        })
        db = getDb();
    }
})

app.get('/students',(req,res)=>{
    
    let students=[];

    db.collection('Students')
    .find()
    .forEach(element => students.push(element))
    .then(()=>{
        res.status(200).json(students)
    })
    .catch(()=>{
        res.status(500).json(` Could not fetch data `)
    })
})

app.get('/students/:id',(req,res)=>{

    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json('Object ID is not valid')
    }

    db.collection('Students')
    .findOne({_id : ObjectId(req.params.id)})
    .then(doc=>{

        if(doc == null)
        {
            return res.status(404).json("Not found any Student with this ID ")
        }

        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).send('No Student find with this ID')
    })
})

app.post('/students',(req,res)=>{
    const student = req.body;

    db.collection('Students')
    .insertOne(student)
    .then(result =>{
        res.status(201).json(result)
    })
    .catch(err=>{
        res.status(500).json(`Could not create a new Document`)
    })
})

app.patch('/students/:id',(req,res)=>{
    const {name,department,location} = req.body

    if(!ObjectId.isValid(req.params.id)){
        res.status(500).json('Object ID is not valid')
    }
    
    db.collection('Students')
    .findOne({_id : ObjectId(req.params.id)})
    .then(doc=>{
        
        if(name)    doc.name = name
        
        if(department)  doc.department=department

        if(location)    doc.location=location

        res.status(200).json(doc)
    })
    .catch((err)=>{
        res.status(304).json('Unable to Modify the content')
    })
})

app.delete('/students/:id',(req,res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.status(400).json('ObjectId is not valid')
    }

    db.collection('Students')
    .deleteOne({_id : ObjectId(req.params.id)})
    .then(doc =>{
        res.status(200).json(doc)
    })
    .catch(err=>{
        res.status(500).json('Could not delete the document')
    })
})

app.all('*',(req,res)=>{
    res.status(400).json('Error from your side , while Requesting')
})

