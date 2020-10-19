const express = require('express');


const app = express();
app.set('view-engine','ejs');
app.use(express.static('views/static'));

app.get('/room',(req, res)=>{
    res.render('pages/room.ejs');
});

app.get('/',(req,res)=>{
    res.render('pages/index.ejs');
});

app.listen(8080,()=> console.log(`Server is listening at port 8080`));