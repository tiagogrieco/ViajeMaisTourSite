export default function Placeholder({ title }: { title: string }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-300">{title}</h1>
        </div>
    );
}
