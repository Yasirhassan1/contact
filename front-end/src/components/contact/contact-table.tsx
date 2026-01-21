import { Contact } from "@/types/types";

interface ContactTableProps {
    contacts: Contact[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isAdded: boolean; // for animation
}

export default function ContactTable({
    contacts,
    onEdit,
    onDelete,
    isAdded,
}: Readonly<ContactTableProps>) {
    return (
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
                        {contacts?.map((cur, ind) => (
                            <tr
                                key={cur._id}
                                className={`hover:bg-blue-50/50 transition ${ind === 0 && isAdded ? "pulse-2" : ""
                                    }`}
                            >
                                <td className="p-4 text-gray-700">{cur.name}</td>
                                <td className="p-4 text-gray-600">{cur.phoneNo}</td>
                                <td className="p-4 text-gray-600">{cur.email}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            className="px-4 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition text-sm font-medium"
                                            onClick={() => onEdit(cur._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-4 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                                            onClick={() => onDelete(cur._id)}
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
    );
}
