import classNames from "classnames";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsExclamationCircle } from "react-icons/bs";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { RegisterFormInputs } from "../ManageStorage/interfaces/form_validation";

const SocialLoginA = styled.a.attrs({
  // type: 'button',
  className: 'transition duration-200 border border-gray-200 text-gray-500 w-full py-2.5  text-sm shadow-sm hover:shadow-md font-normal text-center inline-block'
})``;

enum FORM_STATE {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}

function LoginForm() {
  return <>

    <div className="px-5 py-7">
      <label className="font-semibold text-sm text-gray-600 pb-1 block">Email</label>
      <input type="text" className="border  px-3 py-2 mt-1 mb-5 text-sm w-full" />

      <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
      <input type="text" className="border  px-3 py-2 mt-1 mb-5 text-sm w-full" />

      <button type="button" className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5  text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
        <span className="inline-block mr-2">Login</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>

    </div>

    <div className="p-5">
      <div className="grid grid-cols-3 gap-1">
        {/* <SocialLoginA>MailUp</SocialLoginA> */}
        <SocialLoginA href={[process.env.REACT_APP_GOOGLE_AUTH_URL, process.env.REACT_APP_OAUTH_REDIRECT_BASE_URL].join("")}>Google</SocialLoginA>
        <SocialLoginA href={[process.env.REACT_APP_GITHUB_AUTH_URL, process.env.REACT_APP_OAUTH_REDIRECT_BASE_URL].join("")}>GitHub</SocialLoginA>
      </div>
    </div>

  </>
}


function RegisterForm() {
  const { watch, control, getValues, register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    // defaultValues: { name: profile?.name }
  });

  const password = watch("password");

  const onSubmit = () => {

  }

  return <div className="px-5 py-7">
    <label className="font-semibold text-sm text-gray-600 pb-1 block">Email</label>

    <Controller
      name="email"
      control={control}
      rules={{
        required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      }}
      render={({ field }) =>
        <input type="email" placeholder="john.doe@email.com" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.email })} {...field} />} />

    <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>

    <Controller
      name="password"
      control={control}
      rules={{ required: true }}
      render={({ field }) => <input type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.password })} {...field} />} />

    <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirm Password</label>

    <Controller
      name="confirmPassword"
      control={control}
      rules={{
        required: true,
        validate: value => value === password || "The passwords do not match"
      }}
      render={({ field }) => <input type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.confirmPassword })} {...field} />} />

    <button onClick={handleSubmit(onSubmit)} type="button" className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5  text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
      <span className="inline-block mr-2">Register</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>

  </div>



}

export default function Login() {

  const [formState, setFormState] = useState(FORM_STATE.LOGIN);

  useEffect(() => {
    console.log("env", process.env);
  })

  const { state } = useLocation();
  console.log(state);

  const { authError } = (state as { authError?: string }) ?? { authError: null };


  return <div className="flex flex-col justify-center sm:py-12">
    <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <h1 className="font-bold text-center text-2xl mb-5">Welcome to DeployApp</h1>

      <div className="bg-white shadow w-full  divide-y divide-gray-200">
        {formState === FORM_STATE.LOGIN && <LoginForm />}
        {formState === FORM_STATE.REGISTER && <RegisterForm />}


        <div className="py-5">
          <div className="grid grid-cols-2 gap-1">

            <div className="text-center sm:text-left whitespace-nowrap">
              <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm  text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span className="inline-block ml-1">Forgot Password</span>
              </button>
            </div>

            {/* <div className="text-center sm:text-right whitespace-nowrap">
              <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm  text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-bottom	">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="inline-block ml-1">Help</span>
              </button>
            </div> */}

            <div className="text-center sm:text-right whitespace-nowrap">
              {formState === FORM_STATE.LOGIN && <button onClick={() => { setFormState(FORM_STATE.REGISTER); }} className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm  text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">

                <FaUserPlus className="inline-block align-text-top" size='1.2em' />
                <span className="inline-block ml-1">Register</span>
              </button>}

              {formState !== FORM_STATE.LOGIN && <button onClick={() => { setFormState(FORM_STATE.LOGIN); }} className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm  text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">

                <FaUser className="inline-block align-text-top" size='1.2em' />
                <span className="inline-block ml-1">Login</span>
              </button>}

            </div>

          </div>
        </div>
      </div>
      <div className="py-5">
        <div className="grid grid-cols-2 gap-1">

          <div className="text-center sm:text-left whitespace-nowrap">
            <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm  text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="inline-block ml-1">Back to your-app.com</span>
            </button>
          </div>



        </div>

        {authError && <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
          <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
          <div className="min-w-0">
            <p>An error occurred during login.</p>
            {authError}
          </div>
        </div>}

      </div>
    </div>
  </div>
}