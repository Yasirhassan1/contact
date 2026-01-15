import { useState, useEffect } from "react";
import { Contact } from "../types/types";
import axios from "axios";
export const useContact = ()=>{
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const [contacts, setContacts]  = useState<Contact[]>([])
      const [showForm, setShowForm] = useState<boolean>(false)
      const [isEdit, setIsEdit] = useState<boolean>(false)
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
        axios.get(`${apiUrl}/`)
       .then((response)=>{
        setContacts(response.data.contacts)
        setIsLoading(false);
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
              setIsLoading(false)
            }
          })
          .catch((error) => {
            console.log(error);
            setSearchIds(null);
            setIsLoading(false)
          });
        }
        else if(name ==""){
          setIsSearched(false)
          setIsLoading(false)
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
    // ... export everything else your UI needs
  };
}