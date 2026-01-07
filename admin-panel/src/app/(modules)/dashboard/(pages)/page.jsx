"use client";
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner";


export default function Page() {


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <Card className="cursor-pointer hover:bg-[var(--primary)] transition duration-200 ease-in-out">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Users </h2>
            <p className="text-2xl font-bold mt-2">1,240</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-[var(--primary)] transition duration-200 ease-in-out">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-2xl font-bold mt-2">$23,000</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-[var(--primary)] transition duration-200 ease-in-out">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Active Sessions</h2>
            <p className="text-2xl font-bold mt-2">150</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
