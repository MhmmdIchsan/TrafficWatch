import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import React from "react";

type LoginFormInputs = {
    email: string;
    password: string;
  };
  
  export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  
    const onSubmit = (data: LoginFormInputs) => {
      console.log("Login Data:", data);
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-4 shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="you@example.com" 
                  type="email" 
                  {...register("email", { required: "Email is required" })} 
                  className="mt-1"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  placeholder="Your password" 
                  type="password" 
                  {...register("password", { required: "Password is required" })} 
                  className="mt-1"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-4">Login</Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <a href="/register" className="text-blue-500">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }