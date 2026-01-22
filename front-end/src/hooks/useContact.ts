"use client";
import { useState, useEffect } from "react";
import { Contact } from "@/types/types";
import { contactService } from "@/services/contact.service";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
export const useContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchIds, setSearchIds] = useState<string[] | null>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  // UI State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [character, setCharacter] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const {isAuthenticated, logout} = useAuth()
  const [form, setForm] = useState<Contact>({
    _id: "",
    name: "",
    phoneNo: "",
    email: "",
  });

 

  // Helper to handle 401 errors
  const handleError = (error: unknown) => {
    console.error(error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      
      logout();
    }
    setIsLoading(false);
  };

    
 

  const getAllContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data.reverse());
      setIsLoading(false);
      setIsAdded(false);
    } catch (error) {
      handleError(error);
    }
  };

  const createContact = async (data: Partial<Contact> | FormData) => {
    setIsLoading(true);
    // Handle both FormData (legacy/action) and object (from new form)
    let payload: Partial<Contact> = {};
    if (data instanceof FormData) {
      payload = {
        name: data.get("name") as string,
        phoneNo: data.get("phoneNo") as string,
        email: data.get("email") as string
      }
    } else {
      payload = data;
    }

    try {
      const response = await contactService.create(payload);
      setContacts(response.reverse());
      setIsAdded(true);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      setShowForm(false);
    }
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    setIsLoading(true);
    try {
      const response = await contactService.update(id, data);
      setContacts(response.reverse());
      setShowForm(false);
      setIsEdit(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await contactService.delete(id);
      setContacts(data.reverse());
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchContact = async (name: string) => {
    setIsLoading(true);
    if (!name) {
      setIsSearched(false);
      setIsLoading(false);
      setSearchIds(null);
      return;
    }

    setIsSearched(true);
    try {
      const ids = await contactService.search(name);
      setSearchIds(ids || null);
    } catch (error) {
      handleError(error);
      setSearchIds(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAllContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, isAuthenticated]);


  // Debounced search
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      searchContact(character);
    }, 500); // Reduced delay for better UX

    return () => clearTimeout(delayInputTimeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  const setFormData = (id: string) => {
    const contact = contacts.find((c) => c._id === id);
    if (contact) {
      setForm(contact);
    }
  };

  return {
    contacts,
    showForm,
    setShowForm,
    isEdit,
    setIsEdit,
    isAdded,
    editId,
    setEditId,
    form,
    setForm,
    setFormData,
    character,
    setCharacter,
    searchIds,
    isSearched,
    isLoading,
    setIsLoading,
    createContact,
    updateContact,
    deleteContact,
    isLoggedIn,
    setIsLoggedIn,
  };
};
