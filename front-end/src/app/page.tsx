"use client";
import Loader from "@/components/ui/loader";
import { useContact } from "@/hooks/useContact";
import Login from "@/features/auth/components/login-form";
import { isTokenAvalable, removeToken } from "@/lib/local-storage";
import ContactTable from "@/components/contact/contact-table";
import ContactSearch from "@/components/contact/contact-search";
import ContactForm from "@/components/contact/contact-form";

export default function Page() {
  const {
    contacts,
    showForm,
    setShowForm,
    isEdit,
    setIsEdit,
    setFormData,
    setCharacter,
    editId,
    setEditId,
    searchIds,
    isSearched,
    isLoading,
    setIsLoading,
    form,
    // setForm, // No longer needed directly in page
    createContact,
    updateContact,
    deleteContact,
    isAdded,
    setIsToken
  } = useContact();

  const handleEdit = (id: string) => {
    setFormData(id); // Populates the 'form' state in hook, effectively selecting the contact
    setEditId(id);
    setIsEdit(true);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    setIsLoading(true);
  };

  // Filter contacts based on search
  const displayedContacts = isSearched
    ? contacts?.filter((cur) => searchIds?.includes(cur._id))
    : contacts;

  return (
    <>
      {isTokenAvalable() ? (
        <div className="p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto mt-10 relative">
          {isLoading && <Loader />}

          {/* CREATE FORM */}
          {showForm && (
            <ContactForm
              title="Create Contact"
              submitLabel="Create"
              onCancel={() => setShowForm(false)}
              onSubmit={(data) => createContact(data)}
            />
          )}

          {/* EDIT FORM */}
          {isEdit && (
            <ContactForm
              key={editId}
              title="Edit Contact"
              submitLabel="Update"
              submitColor="bg-yellow-500"
              initialData={form} // Pass the selected contact data
              onCancel={() => setIsEdit(false)}
              // Fix: updateContact now accepts data
              onSubmit={(data) => updateContact(editId, data)}
            />
          )}

          {/* MAIN CARD */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-5 sm:p-6 transition ${showForm || isEdit ? "blur-sm" : ""
              }`}
          >
            <div className="flex gap-4 justify-between" > 
               <strong className="text-blue-600 text-2xl font-semibold block mb-4">
              Contact List
            </strong>
              
              <button className=" underline cursor-pointer text-black p-3 rounded-md   transition" onClick={
                ()=>{
                  removeToken()
                setIsToken(false)
                }
                }>Log Out</button>

                
                </div>
           

            <ContactSearch onChange={(val) => {
              setCharacter(val);
              setIsLoading(true);
            }} />

            <ContactTable
              contacts={displayedContacts}
              isAdded={isAdded}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Footer Button */}
            <div className="mt-6 flex gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 transition shadow-md hover:shadow-lg rounded-xl text-white font-semibold p-4 w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setShowForm(!showForm);
                }}
              >
                <span className="text-xl">+</span> Create New Contact
                
              </button>
             
            </div>
          </div>
        </div>
      ) : (
        <Login setIsToken={setIsToken} />
      )}
    </>
  );
}
