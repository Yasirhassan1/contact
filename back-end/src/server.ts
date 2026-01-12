import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'


dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());
const PORT = Number(process.env.PORT) ||5000;

let contacts = [
    {
        id: 1,
        name: "Amir",
        phoneNo: "03554769934",
        email: "amir@gmail.com",

    },

   
]

app.use("/hey", (req:Request, res:Response, next:NextFunction)=>{
    console.log("middle ware")
    next()
})

app.get("/", (req:Request, res:Response)=>{
    res.json(contacts)
});

app.post("/create", (req:Request, res:Response)=>{
    const newContact = req.body;
    
    contacts.push(newContact);
    res.json({
        success:true
    })
}

)



app.delete("/delete/:id", (req:Request, res:Response)=>{
    contacts = contacts.filter((cur)=>(Number(req.params.id) !== cur.id))

})

app.put("/edit/:id",  (req:Request, res:Response)=>{
    try{
    const {name, phoneNo, email} = req.body;
    contacts = contacts.map((cur)=>{
        if(Number(req.params.id) === cur.id){
            return {
    id: cur.id,
    name: name ?? cur.name,
    phoneNo: phoneNo ?? cur.phoneNo,
    email: email ?? cur.email
  };

        }
        return cur
    })
    res.json({
        success:true
    })
    }
    catch(err){
        console.log(err)
    }
})

app.get("/search/:character", (req: Request, res: Response) => {
  try {
    const character = req.params.character;

    if (!character) {
      return res.json({ success: false, id: null });
    }

    const search = character.toLowerCase();

    const targetIds = contacts.filter((cur) =>
      cur.name.toLowerCase().includes(search)
    )?.map((cur)=> cur.id);

    if (targetIds == null) {
      return res.json({
        success: false,
        id: null,
      });
    }

    res.json({
      success: true,
      ids: targetIds,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});



app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

