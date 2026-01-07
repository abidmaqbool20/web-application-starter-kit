export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Login</h2>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input placeholder="Email" type="email" />
                    <Input placeholder="Password" type="password" />
                    <Button className="w-full">Login</Button>
                </CardContent>
            </Card>
        </div>
    );
}
