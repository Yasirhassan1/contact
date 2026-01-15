import { type Request, type Response } from "express";
import contactModel from "../models/contact.model.js";

export const  getAllContacts = async (req:Request, res:Response)=>{
  try{
    const contacts = await contactModel.find().select(
  "_id name phoneNo email"
);
    res.status(200).json({success:true, contacts})
  }
  catch(err){
    console.log(err)
    res.json({
      success:false
    })
  }
    
}


export const createContact = async (req:Request, res:Response)=>{
    const {name, phoneNo, email} = req.body;
    try{
await contactModel.create({
  name: name,
  phoneNo: phoneNo,
  email: email,
});

  const contacts = await contactModel.find().select(
  "_id name phoneNo email"
);
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

export const deleteContact = async (req:Request, res:Response)=>{
try{
    await contactModel.findByIdAndDelete(req.params.id);
      const contacts = await contactModel.find().select(
  "_id name phoneNo email"
);

    res.json({contacts, success:true})
}
catch(err){
  console.log(err)
  res.json({success:false})
}

}


export const updateContact = async (req:Request, res:Response)=>{
    try{
    const {name, phoneNo, email} = req.body;
  await contactModel.findByIdAndUpdate(
  req.params.id,
  {
    name: name,
    phoneNo: phoneNo,
    email:email
  },

);

const contacts = await contactModel.find().select(
  "_id name phoneNo email"
);

res.json({success:true,  contacts})
    
}
catch(err){
  console.log(err)
  res.json({success:false})
}
}

export const searchContact = async (req: Request, res: Response) => {
  try {
    const character = req.params.character;
  const contacts = await contactModel.find().select(
  "_id name phoneNo email"
);

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
}
