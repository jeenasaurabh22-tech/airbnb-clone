const express=require('express');
const path=require('path');
const storeHandler=require('./routes/storeHandler');
const hostHandler=require('./routes/hostHandler');
const rootDir=require('./utils/pathUtil');
const errorController=require('./controller/error');
const app=express();
app.use(express.static(path.join(rootDir,"public")));
app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:true}));
app.use(storeHandler);
app.use("/host",hostHandler);
app.use(express.static(path.join(rootDir, 'public')))

app.use(errorController.getError);

app.listen(3000,()=>{
    console.log('server started on port 3000');
})