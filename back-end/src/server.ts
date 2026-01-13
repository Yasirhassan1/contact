import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.ts";
import contactModel from "./models/contact.model.ts";
dotenv.config()
const app = express();

app.use(cors({
  origin: [
    "https://contact-3k4v.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());



const PORT = Number(process.env.PORT) ||5000;
connectDB()
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

app.get("/", async (req:Request, res:Response)=>{
  try{
    let contacts = await contactModel.find();
    res.json(
  contacts.map(c => ({
    id: c._id,
    name: c.name,
    phoneNo: c.phoneNo,
    email: c.email,
    createdAt: c.createdAt,
  }))
);
  }
  catch(err){
    console.log(err)
    res.json({
      success:false
    })
  }

    
});

app.post("/create", async (req:Request, res:Response)=>{
    const {name, phoneNo, email} = req.body;
    try{
await contactModel.create({
  name: name,
  phoneNo: phoneNo,
  email: email,
});

let contacts = await contactModel.find()
   res.json({
      contacts,
        success:true
    })
    }
    catch(err){
      console.log(err)
       res.json({
        success:false
    })
    }
    
 
 
}

)



app.delete("/delete/:id",  async (req:Request, res:Response)=>{
try{
    await contactModel.findByIdAndDelete(req.params.id);
    let contacts = await contactModel.find()

    res.json({contacts, success:true})
}
catch(err){
  console.log(err)
  res.json({success:false})
}

})

app.put("/edit/:id",  async (req:Request, res:Response)=>{
    try{
    const {name, phoneNo, email} = req.body;
   await contactModel.findByIdAndUpdate(
  req.params.id,
  {
    name: name,
    phoneNo: phoneNo,
    email:email
  },
res.json({success:true})
);
    
}
catch(err){
  console.log(err)
  res.json({success:false})
}
}
)


app.get("/search/:character", async (req: Request, res: Response) => {
  try {
    const character = req.params.character;
let contacts = await contactModel.find();

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

