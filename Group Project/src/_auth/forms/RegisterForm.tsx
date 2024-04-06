import { z } from "zod";
import { Button } from "../../../@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../@/components/ui/form"
import { Input } from "../../../@/components/ui/input";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../@/components/ui/use-toast"
import {v4} from 'uuid';
import Loader from "../../_root/shared/Loader";
import { useUserContext } from "../../../context/AuthContext";
import {useCreateUserAccount, useSignInAccount} from '../../../@/lib/react_query/queryNmutation';


export const RegisterValidation = z.object({
  userid: z.string(),
  username: z.string().min(2, { message: 'Too short' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be atleast 8 characters.' }),
})


function SignupForm() {
  // constents 
  const { toast } = useToast()
  const navigate = useNavigate();
  
  // tanstack query, context and appwrite 
  const {checkAuthUser} = useUserContext();
  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();
  const {mutateAsync: signInAccount} = useSignInAccount();

  // 1. Form definition.
  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      userid: v4(),
      username: "",
      email:"",
      password:""
    },
  })

  // 2. Submit handler.
  async function onSubmit(values: z.infer<typeof RegisterValidation>) {
    const newUser = await createUserAccount(values);
    if(!newUser){
      return toast({
        title: "Sign up failed. Please try again",
      });
    }

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
      console.log(isLoggedIn)
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
        <h2 className="h3-bold md:h2-bold pt-4 sm:pt-4">Create a new account</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-2">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary">
          {isCreatingUser?(
            <div className="flex-center gap-2">
              <Loader/>Loading....
            </div>
          ):("Sign up")}
        </Button>
        <p className="text-small-regular text-light-2 text-center pt-2">Already have an account?
        <Link to="/login" className="text-primary-500 text-small-semibold mf-1">Login</Link></p>
      </form>
      </div>
    </Form>
  )
}

export default SignupForm