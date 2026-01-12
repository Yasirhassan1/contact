"use client"

import { useEffect, useState } from "react";
import axios from "axios";

type Contact = {
        id: number,
        name: string,
        phoneNo: string,
        email: string,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

async function fetchContacts():Promise<Contact[]>{
  const data =  await fetch(apiUrl)
  return data.json()
}

function deleteContact(id:number){
  axios.delete(`${apiUrl}/delete/${id}`)
  .then((response)=>{
  })
   .catch(function (error) {
    console.log(error);
  });
}




export default function Page(){
  const [contacts, setContacts]  = useState<Contact[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<number>(0)
  const [searchName, setSearchName] = useState<string>("")
  const [searchId, setSearchId] = useState<number | null>(null) 

 const [form, setForm] = useState<Contact>({
  id: 0,
  name: "",
  phoneNo: "",
  email: ""
});

function searchContact(name: string) {
  if(name){


  axios
    .get(`${apiUrl}/search/${name}`)
    .then((response) => {
      
      if (response.data.success) {
      
        setSearchId(response.data.id);
     
      } else {
        setSearchId(null);
      }
    })
    .catch((error) => {
      console.log(error);
      alert("helh")
      setSearchId(null);
    });
  }
  else if(name ==""){
    setSearchId(null)
  }
}

function updateContact(id:number){
  axios.put(`${apiUrl}/edit/${id}`, {
    id: form.id,
    name:form.name,
    phoneNo:form.phoneNo,
    email:form.email
  })
  .then((response)=>{
 alert(response.status)
  })
   .catch(function (error) {
    console.log(error);
  });


}
useEffect(()=>{
 async function fett(){
   setContacts(await fetchContacts())
 }
 fett()

}, [showForm])



useEffect(()=>{

 searchContact(searchName);

 
}, [searchName])


function createContact(formData:FormData){
const name = formData.get("name")
const phoneNo = formData.get("phoneNo")
const email = formData.get("email")

axios.post(`${apiUrl}/create`, {
    id: contacts.length+1,
    name: name,
    phoneNo: phoneNo,
    email:email
  })
  .then(function (response) {


  })
  .catch(function (error) {
    console.log(error);
  });


}



function setFormData(id:number){
  setForm({
    id: id,
    name:contacts[id-1].name,
    phoneNo:contacts[id-1].phoneNo,
    email:contacts[id-1].email,

  })
}

  return (
   <div className="containerr p-4 flex flex-col gap-4 w-full max-w-2xl shadow mx-auto mt-12 relative">
    {
      showForm &&(
        <form action={createContact}  className="absolute z-20 bg-white flex flex-col gap-1.5 top-0 left-1/2 -translate-x-1/2">
      <input type="text" placeholder="Enter name" className="border border-gray-200 rounded-md p-3" name="name" />
      <input type="text" placeholder="Enter Phone No" className="border border-gray-200 rounded-md p-3" name="phoneNo" />
      <input type="text" placeholder="Enter Email Address" className="border border-gray-200 rounded-md p-3" name="email" />
      <button className="bg-blue-500 rounded-md p-3 text-white">Create</button>
      <button className="bg-red-500 rounded-md p-3 text-white" onClick={()=>{setShowForm(false)}}>Exit</button>
    </form>
      )
    }
    {
      isEdit &&(
        <form  className="absolute z-20 bg-white flex flex-col gap-1.5 top-0 left-1/2 -translate-x-1/2">
      <input type="text" onChange={(e) =>
  setForm({
    ...form,
    name: e.target.value,
  })
}  value={form.name} placeholder="Enter Name"  className="border border-gray-200 rounded-md p-3" name="name" />
      <input type="text" onChange={(e) =>
  setForm({
    ...form,
    phoneNo: e.target.value,
  })
}
       value={form.phoneNo} placeholder="Enter Phone No" className="border border-gray-200 rounded-md p-3" name="phoneNo" />
      <input type="text"
      onChange={(e) =>
  setForm({
    ...form,
    email: e.target.value,
  })} value={form.email} placeholder="Enter Email Address" className="border border-gray-200 rounded-md p-3" name="email" />
      <button className="bg-blue-500 rounded-md p-3 text-white" onClick={()=> {updateContact(editId)}}>Update</button>
      <button className="bg-red-500 rounded-md p-3 text-white">Exit</button>
    </form>
      )
    }
    
  <strong className="text-blue-600 text-xl font-semibold">Contact List</strong>

  <form>
    <input
      type="text"
      className="w-full border border-gray-200 rounded-md p-3"
      placeholder="Search Contact"
      onChange={(e)=>{setSearchName(e.target.value)}}
    />
  </form>

  <table className={`w-full border-collapse ${showForm && "blur transition-all duration-300"}`}>
    <thead className="bg-blue-600 text-white">
      <tr>
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Phone No</th>
        <th className="p-3 text-left">Email</th>
        <th className="p-3 text-left">Action</th>
      </tr>
    </thead>

    <tbody>
      
        {searchId != null ? (
    <tr
      key={contacts?.[searchId-1]?.id}
      className="bg-gray-100 rounded-md"
    >
      <td className="p-3">{contacts?.[searchId-1]?.name}</td>
      <td className="p-3">{contacts?.[searchId-1]?.phoneNo}</td>
      <td className="p-3">{contacts?.[searchId-1]?.email}</td>
      <td className="p-3 flex gap-3">
        <button
          className="px-3 py-1 rounded bg-yellow-500 text-white"
          onClick={() => {
            setIsEdit(true);
            setEditId(contacts?.[searchId-1]?.id);
            setFormData(contacts?.[searchId-1].id);
          }}
        >
          Edit
        </button>

        <button
          className="px-3 py-1 rounded bg-red-500 text-white"
          onClick={() =>
            deleteContact(contacts?.[searchId]?.id)
          }
        >
          Delete
        </button>
      </td>
    </tr>

  ):
       
        contacts?.map((cur)=>{
          return(
            <tr key={cur?.id} className="bg-gray-100 rounded-md">
              <td className="p-3">{cur?.name}</td>
              <td className="p-3">{cur?.phoneNo}</td>
              <td className="p-3">{cur?.email}</td>
              <td className="p-3 flex gap-3">
          <button className="px-3 py-1 rounded bg-yellow-500 text-white" onClick={
            ()=>{
            setIsEdit(true)
            setEditId(cur.id)
            setFormData(cur.id);

          }}>
            Edit
          </button>

          <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={()=>{deleteContact(cur.id)}}>
            Delete
          </button>
         
        </td>
              

            </tr>
          )
        })
        

      }
      
    </tbody>
    <tfoot className="">
      <tr>
        <td colSpan={4}>
          <button className="bg-blue-500 rounded-md text-white p-3 w-full" onClick={()=>{setShowForm(!showForm)}}>Create New Contact</button>
        </td>
      </tr>
    </tfoot>
  </table>
</div>

   
  );
}
