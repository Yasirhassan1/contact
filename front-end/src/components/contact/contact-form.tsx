import { Contact } from "@/types/types";
import { FormEvent, useState } from "react";

interface ContactFormProps {
    initialData?: Contact;
    onSubmit: (formData: Partial<Contact>) => void;
    onCancel: () => void;
    title: string;
    submitLabel: string;
    submitColor?: string; // e.g., "bg-blue-600"
}

export default function ContactForm({
    initialData,
    onSubmit,
    onCancel,
    title,
    submitLabel,
    submitColor = "bg-blue-600",
}: Readonly<ContactFormProps>) {
    // Local state for controlled inputs (easier for edit mode)
    const [form, setForm] = useState<Partial<Contact>>(initialData || {
        name: "",
        phoneNo: "",
        email: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    const isEdit = !!initialData;
    const inputRingColor = isEdit ? "focus:ring-yellow-400" : "focus:ring-blue-400";
    const titleColor = isEdit ? "text-yellow-500" : "text-blue-600";

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-10" onClick={onCancel}></div>
            <form
                onSubmit={handleSubmit}
                className="fixed z-20 bg-white w-[90%] sm:w-100 p-6 rounded-xl shadow-2xl flex flex-col gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <h2 className={`text-xl font-semibold ${titleColor} text-center`}>
                    {title}
                </h2>

                <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`border rounded-lg p-3 focus:outline-none focus:ring-2 ${inputRingColor}`}
                    name="name"
                />
                <input
                    type="text"
                    required
                    placeholder="Enter Phone No"
                    value={form.phoneNo}
                    onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
                    className={`border rounded-lg p-3 focus:outline-none focus:ring-2 ${inputRingColor}`}
                    name="phoneNo"
                />
                <input
                    type="text"
                    required
                    placeholder="Enter Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`border rounded-lg p-3 focus:outline-none focus:ring-2 ${inputRingColor}`}
                    name="email"
                />

                <button
                    className={`${submitColor} hover:opacity-90 transition rounded-lg p-3 text-white`}
                    type="submit"
                >
                    {submitLabel}
                </button>

                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 transition rounded-lg p-3 text-white"
                    onClick={onCancel}
                >
                    Exit
                </button>
            </form>
        </>
    );
}
