"use client";
import { useState } from 'react';
import { createUser } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { log } from 'console';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
 const router=useRouter();
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let usernameError = '';
    let emailError = '';
    let passwordError = '';

    if (!formData.username) {
      usernameError = 'Username is required.';
    }

    if (!validateEmail(formData.email)) {
      emailError = 'Please enter a valid email address.';
    }

    if (!validatePassword(formData.password)) {
      passwordError = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
    }

    if (usernameError || emailError || passwordError) {
      setErrors({ username: usernameError, email: emailError, password: passwordError });
    } else {
      setErrors({ username: '', email: '', password: '' });
      try{
      await createUser(formData);
      toast("User created successfully redirecting to login...");
      setTimeout(()=>router.push("/login"),1000);
      }catch(err){
                  const error = err as AxiosError<{ message: string }>;
        
          toast.error(error?.message);
          

      }
      console.log('Signing up with:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData);
    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-full md:h-[41rem] shadow-md grid justify-center items-center">
      <div className="flex w-96 bg-white flex-col space-y-5 rounded-lg border py-10 px-5 shadow-xl mx-auto">
        <div className="mx-auto mb-2 space-y-3">
          <h1 className="text-3xl font-bold text-gray-700">Sign up for Framez</h1>
          <p className="text-gray-500">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`border-1 peer block w-full appearance-none rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0`}
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >
                Enter Your Username
              </label>
              {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
            </div>
          </div>

          <div>
            <div className="relative mt-2 w-full">
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`border-1 peer block w-full appearance-none rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >
                Enter Your Email
              </label>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>

          <div>
            <div className="relative mt-2 w-full">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border-1 peer block w-full appearance-none rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >
                Enter Your Password
              </label>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
          </div>

          <div className="relative mt-2 w-full">
            <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white">
              Sign Up
            </button>
          </div>
          <p className=" text-center mt-3  text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <Link href="login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                  </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
