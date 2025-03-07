"use client"
import { useState, useEffect } from 'react';
import { axiosInstance as axios } from "../../axiosInstance/axios";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { handleOAuth } from "../../actions/oAuthHandler";
import { storeToken } from '@/app/actions/cookieHandler';
import { GithubIcon, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { AxiosError } from 'axios';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const { data: session, status } = useSession();

  useEffect(() => {
    const processOAuth = async () => {
      if (status === "authenticated" && session?.user) {
        const token = await handleOAuth(session.user);
        if (token) {
          await storeToken("token", token);
          console.log("Token stored:", token);
          router.push("/home");
        }
      }
    };
    processOAuth();
  }, [status, session, router]);
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let emailError = '';
    let passwordError = '';

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address.';
    }

    if (!validatePassword(password)) {
      passwordError = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
    }

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
    } else {
      setErrors({ email: '', password: '' });
      try {
        setLoading(true);

        const response = await axios.post("/api/login", { email, password });
        toast(response?.data.message);
        storeToken("token", response?.data?.token);
        router.push("/home");

      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.log(error);
        toast.error(error?.message||error.response?.data?.message || "Something went wrong");
      }
      finally{
        setLoading(false);
      }
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      console.log("Starting Github Sign-In...");
      await signIn("github", { callbackUrl: "/home" });
    } catch (error) {
      console.error(JSON.stringify(error));
    }finally{
      setLoading(false);

    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      console.log("Starting Google Sign-In...");
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Error during Google Sign-In:", JSON.stringify(error));
    }finally{
      setLoading(false);
    }
  };
  
  return (
    <div className="relative h-screen md:h-[41rem] shadow-md grid justify-center items-center">
      
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-gray-800" />
        </div>
      )}

      <div className="flex w-96 bg-white flex-col space-y-5 rounded-lg border py-10 px-5 shadow-xl mx-auto relative">
        <div className="mx-auto mb-2 space-y-3">
          <h1 className="text-3xl font-bold text-gray-700">Log into Framez</h1>
          <p className="text-gray-500">Login to access your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mt-2'>
            <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`border-1 peer block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none`} placeholder="Enter Your Email" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className='mt-2'>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`border-1 peer block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none`} placeholder="Enter Your Password" />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full rounded-lg bg-gray-800 hover:scale-95 py-3 font-bold text-white mt-2">Login</button>
        </form>

        <button onClick={handleGithubSignIn} className="w-full flex items-center justify-center rounded-lg bg-gray-900 hover:scale-95 py-3 font-bold text-white mt-3">
          <GithubIcon className='text-white mx-4' /> Sign in with GitHub
        </button>

        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center rounded-lg bg-white border hover:scale-95 py-3 font-bold text-gray-700 mt-3">
          <FcGoogle className='text-gray-700 mx-4' size={20} /> Sign in with Google
        </button>

        <p className="text-center mt-3 text-sm font-light text-gray-500">
          Don't have an account? <Link href="register" className="font-medium text-primary-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
