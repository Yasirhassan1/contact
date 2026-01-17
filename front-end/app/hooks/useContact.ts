import { useState, useEffect } from "react";
import { Contact } from "../types/types";
import axios from "axios";

export const useContact = ()=>{
      const [contacts, setContacts]  = useState<Contact[]>([])
      const [showForm, setShowForm] = useState<boolean>(false)
      const [isEdit, setIsEdit] = useState<boolean>(false)
      const [isAdded, setIsadded] = useState<boolean>(false)
      const [editId, setEditId] = useState<string>("")
      const [character, setCharacter] = useState<string>("")
      const [searchIds, setSearchIds] = useState<string[] | null>([]) 
      const [isSearched, setIsSearched] = useState<boolean>(false)
      const [isLoading, setIsLoading] = useState<boolean>(true)
       const [form, setForm] = useState<Contact>({
  _id: "",
  name: "",
  phoneNo: "",
  email: ""
});


      function getAllContacts(){
        axios.get(`/api/GET`)
       .then((response)=>{
       
        setContacts(response.data)
        setIsLoading(false);
        setIsadded(false)
       })
       .catch((err)=>{
        console.log(err)
       })
      }
      
     function deleteContact(id: string) {
  setIsLoading(true);
  if (!id) return console.error("No ID provided to delete function!");

  // We call our internal Next.js proxy
  // Note: axios.delete requires the body to be under the 'data' key
  axios.delete(`/api/DELETE`, { 
    data: { id: id } 
  })
  .then((response) => {
    // response.data is the array returned from NextResponse.json(contacts)
    setContacts(response.data); 
    setIsLoading(false);
  })
  .catch((error) => {
    console.error("Delete Error:", error);
    setIsLoading(false);
  });
}
      
   function searchContact(name: string) {
  if (name) {
    setIsSearched(true);
    setIsLoading(true);

    // Use params: { name } to send it as /api/search?name=...
    axios.get(`/api/search`, {
        params: { name: name } 
      })
      .then((response) => {
        if (response.data.success) {
          setSearchIds(response.data.ids);
        } else {
          setSearchIds(null);
        }
        setIsLoading(false);
        setIsadded(false);
      })
      .catch((error) => {
        console.error("Search Error:", error);
        setSearchIds(null);
        setIsLoading(false);
      });
  } else {
    setIsSearched(false);
    setIsLoading(false);
    setIsadded(false);
  }
}
      
     function updateContact(id: string) {
  setIsLoading(true);

  // Send the updated form data directly
  // 'form' should contain the name, phoneNo, and email
  axios.put(`/api/PUT`, {
      id: id,
      name: form.name,
      phoneNo: form.phoneNo,
      email: form.email
    })
    .then((response) => {
      // response.data is the array returned from your Next.js proxy
      setContacts(response.data);
      setIsLoading(false);
      setShowForm(false); // Close the edit form
    })
    .catch((error) => {
      console.error("Update Error:", error);
      setIsLoading(false);
    });
}
      useEffect(()=>{
      getAllContacts();
      
      }, [showForm])
      
      
      
useEffect(() => {

  const delayInputTimeoutId = setTimeout(() => {
        searchContact(character);
  }, 1000);

  return () => clearTimeout(delayInputTimeoutId);
  
}, [character]); 

      
      function setFormData(id:string){
        const find  = contacts?.find((cur)=> id === cur._id)
        setForm({
          _id: id,
          name:find?.name as string,
          phoneNo:find?.phoneNo as string,
          email:find?.email as string,
      
        })
      }
      function createContact(formData:FormData){
        
      const name = formData.get("name")
      const phoneNo = formData.get("phoneNo")
      const email = formData.get("email")
      
      axios.post(`/api/POST`, {
          name: name,
          phoneNo: phoneNo,
          email:email
        })
        .then(function (response) {
          setContacts(response.data)
          setIsadded(true)
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
        });
      
      setShowForm(false)
      }
      
    return {
      contacts,
    showForm, setShowForm,
    setFormData,
    isEdit, setIsEdit,
    character, setCharacter,
    editId, setEditId,
    searchIds,
    isSearched,
    isLoading, setIsLoading,
    form, setForm,
    createContact, 
    updateContact,
    deleteContact,
    isAdded,
    // ... export everything else your UI needs
  };
}