import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-black">

      {/* LEFT SIDE */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          Find Your <span className="text-purple-600 dark:text-purple-400">Perfect Match</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          A smart AI-assisted matrimonial platform. Simple, private, and beautiful.
        </p>

        <Link href="/auth/register">
          <Button size="lg" className="px-10 text-lg">
            Get Started
          </Button>
        </Link>
      </div>

      {/* RIGHT SIDE - QUICK REGISTER FORM */}
      <Card className="md:w-1/3 w-full mt-10 md:mt-0 shadow-xl">
        <CardHeader>
          <h3 className="text-xl font-semibold">Join Free</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />

          <Link href="/auth/register">
            <Button className="w-full">Continue</Button>
          </Link>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-600">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
