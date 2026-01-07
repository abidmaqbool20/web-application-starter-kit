export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Welcome!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/proposals">
                    <Card className="cursor-pointer hover:shadow-lg transition">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Your Matches</h3>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/profile">
                    <Card className="cursor-pointer hover:shadow-lg transition">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Update Profile</h3>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/settings">
                    <Card className="cursor-pointer hover:shadow-lg transition">
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Settings</h3>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
