export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input placeholder="Full Name" />
                    <Input placeholder="Email" type="email" />
                    <Input placeholder="Password" type="password" />
                    <Input placeholder="City" />

                    <Button className="w-full">Register</Button>

                    <p className="text-sm text-center mt-2">
                        Already registered? <Link href="/auth/login" className="text-purple-600">Login</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
