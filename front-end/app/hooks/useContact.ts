"use client";
import { useState, useEffect } from "react";
import { Contact } from "../types/types";
import axios from "axios";
import { getToken, isTokenAvalable, removeToken } from "../api/api";

export const useContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAdded, setIsadded] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [character, setCharacter] = useState<string>("");
  const [searchIds, setSearchIds] = useState<string[] | null>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLog, setIsLog] = useState<boolean | null>(null);
  const NEXT_PUBLIC_ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

  const [form, setForm] = useState<Contact>({
    _id: "",
    name: "",
    phoneNo: "",
    email: "",
  });
  const token = getToken()

  function getAllContacts() {
    axios
      .get(`${NEXT_PUBLIC_ROOT_URL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((Response) => {
        setContacts(Response.data.contacts.reverse());
        setIsLoading(false);
        setIsadded(false);
      })
      .catch((err) => {
        if (err.status == 401) {
          removeToken()
          setIsLog(isTokenAvalable);
        }
        console.log(err);
      });
  }

  function deleteContact(id: string) {
    setIsLoading(true);
    if (!id) return console.error("No ID provided to delete function!");

    axios
      .delete(`${NEXT_PUBLIC_ROOT_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // response.data is the array returned from NextResponse.json(contacts)
        setContacts(response.data.contacts.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.status == 401) {
          removeToken()
          setIsLog(isTokenAvalable);
        }
        console.error("Delete Error:", error);
        setIsLoading(false);
      });
  }

  function searchContact(name: string) {
    if (name) {
      setIsSearched(true);
      setIsLoading(true);

      // Use params: { name } to send it as /api/search?name=...
      axios
        .get(`${NEXT_PUBLIC_ROOT_URL}/search/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          if (error.status == 401) {
            removeToken()
            setIsLog(isTokenAvalable);
          }
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
    axios
      .put(
        `${NEXT_PUBLIC_ROOT_URL}/edit/${id}`,
        {
          name: form.name,
          phoneNo: form.phoneNo,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        // response.data is the array returned from your Next.js proxy
        setContacts(response.data.contacts.reverse());
        setIsLoading(false);
        setShowForm(false); // Close the edit form
      })
      .catch((error) => {
        if (error.status == 401) {
          removeToken()
          setIsLog(isTokenAvalable);
        }
        console.error("Update Error:", error);
        setIsLoading(false);
      });
  }
  useEffect(() => {
    if (isLog) {
      getAllContacts();
    }
  }, [showForm, isLog]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      searchContact(character);
    }, 1000);

    return () => clearTimeout(delayInputTimeoutId);
  }, [character]);

  function setFormData(id: string) {
    const find = contacts?.find((cur) => id === cur._id);
    setForm({
      _id: id,
      name: find?.name as string,
      phoneNo: find?.phoneNo as string,
      email: find?.email as string,
    });
  }
  function createContact(formData: FormData) {
    const name = formData.get("name");
    const phoneNo = formData.get("phoneNo");
    const email = formData.get("email");

    axios
      .post(
        `${NEXT_PUBLIC_ROOT_URL}/create`,
        {
          name: name,
          phoneNo: phoneNo,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(function (response) {
        setContacts(response.data.contacts.reverse());
        setIsadded(true);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        if (error.status == 401) {
          removeToken()
          setIsLog(isTokenAvalable);
        }
      });

    setShowForm(false);
  }

  return {
    contacts,
    showForm,
    setShowForm,
    setFormData,
    isEdit,
    setIsEdit,
    character,
    setCharacter,
    editId,
    setEditId,
    searchIds,
    isSearched,
    isLoading,
    setIsLoading,
    form,
    setForm,
    createContact,
    updateContact,
    deleteContact,
    isAdded,
    isLog,
    setIsLog,
    // ... export everything else your UI needs
  };
};
