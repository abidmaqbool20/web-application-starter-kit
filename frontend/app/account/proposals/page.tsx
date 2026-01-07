export default function ProposalsPage() {
    const mockMatches = [
        { name: "Aisha", age: 26, city: "Lahore" },
        { name: "Sara", age: 24, city: "Dubai" },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Your Proposals</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockMatches.map((m, i) => (
                    <Card key={i} className="shadow-md">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">{m.name}</h3>
                            <p>{m.age} • {m.city}</p>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
