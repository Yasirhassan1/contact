"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Contact } from "./types/types";
import Loader from "@/app/components/Loader"


const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export default function Page(){
  const [contacts, setContacts]  = useState<Contact[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string>("")
  const [searchName, setSearchName] = useState<string>("")
  const [searchIds, setSearchIds] = useState<string[] | null>([]) 
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

 const [form, setForm] = useState<Contact>({
  _id: "",
  name: "",
  phoneNo: "",
  email: ""
});

function getAllContacts(){
  axios.get(`${apiUrl}/`)
 .then((response)=>{
  setContacts(response.data.contacts)
 })
 .catch((err)=>{
  console.log(err)
 })
}

function deleteContact(id:string){
  axios.delete(`${apiUrl}/delete/${id}`)
  .then((response)=>{
    setContacts(response.data.contacts)
    setIsLoading(false)
    
  })
   .catch(function (error) {
    console.log(error);
  });
}

function searchContact(name: string) {
  if(name){

setIsSearched(true)
  axios
    .get(`${apiUrl}/search/${name}`)
    .then((response) => {
      
      if (response.data.success) {
      
        setSearchIds(response.data.ids);
        setIsLoading(false)
     
      } else {
        setSearchIds(null);
      }
    })
    .catch((error) => {
      console.log(error);
      setSearchIds(null);
    });
  }
  else if(name ==""){
    setIsSearched(false)
  }
}

function updateContact(id:string){
  axios.put(`${apiUrl}/edit/${id}`, {
    id: form._id,
    name:form.name,
    phoneNo:form.phoneNo,
    email:form.email
  })
  .then((response)=>{
   setContacts(response.data.contacts)
   setIsLoading(false)
  })
   .catch(function (error) {
    console.log(error);
  });


}
useEffect(()=>{
getAllContacts();

}, [showForm])



useEffect(()=>{
setTimeout(() => {
 searchContact(searchName);
}, 1000);

}, [searchName]) 


function createContact(formData:FormData){
  
const name = formData.get("name")
const phoneNo = formData.get("phoneNo")
const email = formData.get("email")

axios.post(`${apiUrl}/create`, {
    name: name,
    phoneNo: phoneNo,
    email:email
  })
  .then(function (response) {
    setContacts(response.data.contacts)
    setIsLoading(false)

  })
  .catch(function (error) {
    console.log(error);
  });

setShowForm(false)
}



function setFormData(id:string){
  const find  = contacts?.find((cur)=> id === cur._id)
  setForm({
    _id: id,
    name:find?.name as string,
    phoneNo:find?.phoneNo as string,
    email:find?.email as string,

  })
}

  return (
  <div className="p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto mt-10 relative">
     {
    isLoading && <Loader/>
          
}
    {showForm && (
      <>
        <div className="fixed inset-0 bg-black/40 z-10"></div>

        <form
          action={createContact}
          className="fixed z-20 bg-white w-[90%] sm:w-100 p-6 rounded-xl shadow-2xl flex flex-col gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <h2 className="text-xl font-semibold text-blue-600 text-center">
            Create Contact
          </h2>

          <input
            type="text"
            required
            placeholder="Enter name"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="name"
          />
          <input
            type="text"
            required
            placeholder="Enter Phone No"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="phoneNo"
          />
          <input
            type="text"
            required
            placeholder="Enter Email Address"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="email"
          />

          <button className="bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3 text-white" onClick={()=>setIsLoading(true)}>
            Create
          </button>
         

          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 transition rounded-lg p-3 text-white"
            onClick={() => setShowForm(false)}
          >
            Exit
          </button>
        </form>
      </>
    )}

    {/* EDIT FORM */}
    {isEdit && (
      <>
        <div className="fixed inset-0 bg-black/40 z-10"></div>

        <form className="fixed z-20 bg-white w-[90%] sm:w-[400px] p-6 rounded-xl shadow-2xl flex flex-col gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-xl font-semibold text-yellow-500 text-center">
            Edit Contact
          </h2>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>{
              setForm({ ...form, name: e.target.value })
            setIsLoading(true)
            }
            }
            className="border rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <input
            type="text"
            value={form.phoneNo}
            onChange={(e) =>
              setForm({ ...form, phoneNo: e.target.value })
            }
            className="border rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <input
            type="text"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 transition rounded-lg p-3 text-white"
            onClick={() => {
              updateContact(editId)
              setIsEdit(false)
              setIsLoading(true)

            }}
          >
            Update
          </button>

          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 transition rounded-lg p-3 text-white"
            onClick={() => setIsEdit(false)}
          >
            Exit
          </button>
        </form>
      </>
    )}

    {/* MAIN CARD */}
   <div
  className={`bg-white rounded-2xl shadow-lg p-5 sm:p-6 transition ${
    showForm || isEdit ? "blur-sm" : ""
  }`}
>
  <strong className="text-blue-600 text-2xl font-semibold block mb-4">
    Contact List
  </strong>

  <input
    type="text"
    placeholder="Search Contact..."
    onChange={(e) => setSearchName(e.target.value)}
    className="w-full border border-gray-200 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-400 outline-none transition"
  />

  {/* Scrollable Container */}
  <div className="overflow-hidden border border-gray-100 rounded-xl">
    <div className="max-h-80 overflow-y-auto custom-scrollbar">
      <table className="w-full border-collapse">
        <thead className="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th className="p-4 text-left font-medium">Name</th>
            <th className="p-4 text-left font-medium">Phone</th>
            <th className="p-4 text-left font-medium">Email</th>
            <th className="p-4 text-center font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(isSearched
            ? contacts?.filter((cur) => searchIds?.includes(cur._id))
            : contacts
          )?.map((cur) => (
            <tr key={cur._id} className={`hover:bg-blue-50/50 transition`}>
              <td className="p-4 text-gray-700">{cur.name}</td>
              <td className="p-4 text-gray-600">{cur.phoneNo}</td>
              <td className="p-4 text-gray-600">{cur.email}</td>
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button
                    className="px-4 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition text-sm font-medium"
                    onClick={() => {
                      setIsEdit(true);
                      setEditId(cur._id);
                      setFormData(cur._id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                    onClick={() =>{ 
                      deleteContact(cur._id)
                    setIsLoading(true)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Footer Button - Outside the scroll area */}
  <div className="mt-6">
    <button
      className="bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg rounded-xl text-white font-semibold p-4 w-full flex items-center justify-center gap-2"
      onClick={() => {
        setShowForm(!showForm)
        
      }
      }
    >
      <span className="text-xl">+</span> Create New Contact
    </button>
  </div>
</div>
  </div>
);
}