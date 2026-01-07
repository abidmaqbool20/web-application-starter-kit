"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { setLoginForm, loginRequest, resetLoginForm } from "@/slices/authSlice"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "@/hooks/use-navigate";


export default function LoginPage({
  className,
  ...props
}) {

  const dispatch = useDispatch();
  const loginForm = useSelector((state) => state.auth.loginForm)
  const requesting = useSelector((state) => state.auth.requesting);
  const error = useSelector((state) => state.auth.error);
  const user = useSelector((state) => state.auth.user);
  const { push: navigate } = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(resetLoginForm());
      navigate("/dashboard"); // Redirect after login
    }
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    dispatch(setLoginForm({ field: e.target.id, value: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginRequest({ ...loginForm, user_type: 'system' }))
  }


  return (
    <div className="flex flex-col gap-6" >
      <Card className="overflow-hidden ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" value={loginForm.password} onChange={handleChange} type="password" placeholder="••••••••" required />
              </div>
              {error && <div className="text-red-500 text-sm">{
                typeof error === 'string'
                  ? error
                  : (error?.message || error?.status || 'Login failed. Please check your credentials.')
              }</div>}
              <Button type="submit" disabled={requesting} className="w-full cursor-pointer">
                {requesting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="relative hidden w-90 md:block right-0 rounded-md bg-[var(--primary)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 logo   z-10" >
              <div className="h-full w-full dark:brightness-[0.2] font-bold text-5xl dark:grayscale">Logo</div>
              {/* <img
                src="/logo.png"
                alt="Image"
                className="h-full w-full dark:brightness-[0.2] dark:grayscale"
              /> */}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Copy Rights <a target="_blank" href="https://github.com/abidmaqbool20/">Muhammad Abid Maqbool</a>
      </div>
    </div>
  )
}
