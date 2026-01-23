"use client";
import Loader from "@/components/ui/loader";
import { useContact } from "@/hooks/useContact";
import Login from "@/features/auth/components/login-form";
import ContactTable from "@/components/contact/contact-table";
import ContactSearch from "@/components/contact/contact-search";
import ContactForm from "@/components/contact/contact-form";
import { useAuth } from "@/context/AuthContext";


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
    // isLoggedIn, // Removed
    // setIsLoggedIn, // Removed
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
  /* 
     Removed local auth state management:
     - const [isLog, setIsLog] = useState<boolean |null>(null)
     - useEffect for isAuthenticated()
  */

  const { isAuthenticated, logout } = useAuth();

  // Sync the hook's login function with the component's setIsLoggedIn if needed, 
  // but better to just use isAuthenticated directly. 
  // Ideally, useContact should leverage useAuth or we pass the auth state to it if strictly necessary, 
  // but for now we replace the local check.

  // NOTE: isLog was tri-state (null=loading, true, false). 
  // AuthContext handles loading internally (blocking children rendering until loaded), 
  // so we can assume isAuthenticated is final when this component renders.

  return (
    <>
      {isAuthenticated ? (
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
            <div className="flex gap-4 justify-between items-center">
              <strong className="text-blue-600 text-2xl font-semibold block mb-4">
                Contact List
              </strong>

              <button
                className=" underline cursor-pointer text-black p-3 rounded-md   transition"
                onClick={() => {
                  logout();
                  // setIsLoggedIn(false); // Deprecated in favor of logout
                }}
              >
                <svg className="text-red-500 w-7 fill-current h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z"/></svg>
              </button>
            </div>

            <ContactSearch
              onChange={(val) => {
                setCharacter(val);
                setIsLoading(true);
              }}
            />

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
        <Login />
      )}
    </>
  );
}
