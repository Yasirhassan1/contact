"use client"

import { useEffect, useState } from "react";
import axios from "axios";

type Contact = {
        id: string,
        name: string,
        phoneNo: string,
        email: string,
        createdAt?: string;

};

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

async function fetchContacts():Promise<Contact[]>{
  const data =  await fetch(apiUrl)
  return data.json()
}






export default function Page(){
  const [contacts, setContacts]  = useState<Contact[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editId, setEditId] = useState<string>("")
  const [searchName, setSearchName] = useState<string>("")
  const [searchIds, setSearchIds] = useState<string[] | null>([]) 
  const [isSearched, setIsSearched] = useState<boolean>(false)

 const [form, setForm] = useState<Contact>({
  id: "",
  name: "",
  phoneNo: "",
  email: ""
});

function deleteContact(id:string){
  axios.delete(`${apiUrl}/delete/${id}`)
  .then((response)=>{
    setContacts(response.data.contacts)
    
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

  })
  .catch(function (error) {
    console.log(error);
  });

setShowForm(false)
}



function setFormData(id:string){
  const find  = contacts?.find((cur)=> id === cur.id)
  setForm({
    id: id,
    name:find?.name as string,
    phoneNo:find?.phoneNo as string,
    email:find?.email as string,

  })
}

  return (
  <div className="p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto mt-10 relative">
    {/* CREATE FORM */}
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
            placeholder="Enter name"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="name"
          />
          <input
            type="text"
            placeholder="Enter Phone No"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="phoneNo"
          />
          <input
            type="text"
            placeholder="Enter Email Address"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="email"
          />

          <button className="bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3 text-white">
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
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
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
            onClick={() => updateContact(editId)}
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
        className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {(isSearched
              ? contacts?.filter((cur) =>
                  searchIds?.includes(cur.id)
                )
              : contacts
            )?.map((cur) => (
              <tr
                key={cur.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{cur.name}</td>
                <td className="p-3">{cur.phoneNo}</td>
                <td className="p-3">{cur.email}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => {
                      setIsEdit(true);
                      setEditId(cur.id);
                      setFormData(cur.id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => deleteContact(cur.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={4} className="pt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white p-3 w-full"
                  onClick={() => setShowForm(!showForm)}
                >
                  Create New Contact
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
);
}