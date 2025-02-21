"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContextProvider";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = () => {
    login(form.getValues("email"), form.getValues("password"));
    toast({
      title: "Login Successful",
      description: "Welcome back! You have successfully logged in.",
    });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4">
      <h1 className="text-white text-3xl font-bold mb-8 drop-shadow-lg">
        AI-Powered Lesson Planner
      </h1>
      <Card className="w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-white">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your Email"
                        {...field}
                        className="input-field bg-white/20 text-white placeholder-white/50 focus:ring-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                        className="input-field bg-white/20 text-white placeholder-white/50 focus:ring-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all"
              >
                <Link href={'/lessons'}>Sign In</Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
