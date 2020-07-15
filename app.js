const express = require('express')
const fs= require("fs")
const app = express();
const multer= require("multer")
const { createWorker } = require("tesseract.js");
const worker = createWorker();
// storage
// 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const upload = multer({ storage:storage }).single('avatar');

app.set('view engine','ejs');

// app.get('/upload',(req,res) =>{
//     console.log('hy')
// })

app.use(express.static("public"));

app.get('/',(req,res) =>{
    res.render("index");

});

app.post("/upload",(req,res) =>{
    upload(req,res,err =>{
        // console.log(req.file)
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data) =>{
            if( err ) {

            console.log('this is your error',err)
            
            };


            // worker
            // worker.recognize(data,{ tessjs_create_pdf:'1'})
            // worker.progress(progress =>{
            //         console.log(progress)
            // })
            
            // worker.then(result =>{
            //     res.redirect("/download");
            // })
            // worker.finnaly(() => worker.terminate());

        (async ()=> {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(data, { tessjs_create_pdf: "1"});
            await worker.progress( progress =>{ console.log(progress) })
            res.send(text);
            await worker.then(result =>{
                res.redirect("/download");
            })
            await worker.terminate();
        })();

       
        



        });
    });
});
app.get("/download",(req,res) =>{
    const file= `${__dirname}/tessaract.js-ocr-result.pdf`;
    res.download(file);
});

// start up server

const PORT = 5000 || process.env.PORT;
app.listen(PORT,() => console.log(`Hey i am running on port ${PORT} `))