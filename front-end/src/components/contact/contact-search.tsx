interface ContactSearchProps {
    onChange: (value: string) => void;
}

export default function ContactSearch({ onChange }: Readonly<ContactSearchProps>) {
    return (
        <input
            type="text"
            placeholder="Search Contact..."
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
    );
}
