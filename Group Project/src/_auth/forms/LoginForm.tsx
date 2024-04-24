import { z } from "zod";
import { Button } from "../../../@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../@/components/ui/form"
import { Input } from "../../../@/components/ui/input";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../@/components/ui/use-toast"
import {useSignInAccount } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";
import Loader from "../../_root/shared/Loader";


export const LoginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be atleast 8 characters.' }),
})

function LoginForm() {
  const { toast } = useToast()
  const navigate = useNavigate();

  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const {mutateAsync: signInAccount, isPending: isUser} = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email:"",
      password:""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginValidation>) {
    const session = await signInAccount({
      email:values.email,
      password:values.password
    });

    if(!session){
      return toast({
        title: "Sign up failed. Please try again",
      }); 
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      navigate("/");
    }else{
      return toast({
        title: "Sign up failed. Please try again",
      }); 
    }
  }

  return (
    <Form {...form}>
      <div className="w-420 flex-center flex-col">
      <div className="flex flex-row">
          <img
          src="/assets/mainlogo.png"
          alt="logo"
          />
          <p className="mt-4 text-xl ml-4">CounselEase Connect</p>
        </div>
        <h2 className="h3-bold md:h2-bold pt-4 sm:pt-4">Login</h2>
        <p className="text-light-3 small-medium and md:base-regular">Welcome back please enter your details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="ml-4 mr-4">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="ml-4 mr-4">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary ml-4 mr-4 mt-4">
          {isUserLoading || isUser?(
            <div className="flex-center gap-2">
              <Loader/> Loading....
            </div>
          ):("Sign in")}
        </Button>
        <p className="text-small-regular text-light-2 text-center pt-2">Don't have an account?
        <Link to="/register" className="text-primary-500 text-small-semibold mf-1">Signup</Link></p>
      </form>
      </div>
    </Form>
  )
}

export default LoginForm