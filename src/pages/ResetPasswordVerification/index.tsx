import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import classNames from "classnames";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BsExclamationCircle } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmResetPasswordRequest } from "../../api/interfaces/request/confirm_reset_password_request";
import { confirmResetPassword } from "../../api/Profile";

type ResetPasswordVerificationFormInputs = {
  password: string,
  confirmPassword: string
}

export default function ResetPasswordVerification() {

  const navigate = useNavigate();
  const { state } = useLocation();

  const { confirm_reset_password } = (state as { confirm_reset_password?: string }) ?? { confirm_reset_password: undefined };


  const { watch, control, getValues, register, handleSubmit, formState: { errors } } = useForm<ResetPasswordVerificationFormInputs>({
    // defaultValues: { name: profile?.name }
  });

  const password = watch("password");

  const { isLoading, isSuccess, error, mutate } = useMutation<AxiosResponse<void, any>, AxiosError, ConfirmResetPasswordRequest>((req) => {
    return confirmResetPassword(req);
  }, {
    // this object is a MutateOptions
    onSuccess: () => {
      navigate('/login', { state: { resetPasswordSuccess: true } });
    }
  });

  const onSubmit: SubmitHandler<ResetPasswordVerificationFormInputs> = data => {
    if (confirm_reset_password === undefined) return;
    mutate({ token: confirm_reset_password, password: data.password });
  }

  const disableInputs = isLoading || confirmResetPassword === undefined;

  return <div className="flex flex-col justify-center sm:py-12">
    <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <h1 className="font-bold text-center text-2xl mb-5">Reset password</h1>

      <div className="bg-white shadow w-full  divide-y divide-gray-200">

        <div className="px-5 py-7">
          <label className="font-semibold text-sm text-gray-600 pb-1 block">New Password</label>

          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <input disabled={disableInputs} type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.password })} {...field} />} />

          <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirm new Password</label>

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: true,
              validate: value => value === password || "The passwords do not match"
            }}
            render={({ field }) => <input disabled={disableInputs} type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.confirmPassword })} {...field} />} />

          <button disabled={disableInputs} onClick={handleSubmit(onSubmit)} type="button" className="mb-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5  text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
            <span className="inline-block mr-2">Reset password</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>


          {(!confirm_reset_password || error) && <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
            <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
            <div className="min-w-0">
              Please ensure your password reset link is valid, or request a new one.
            </div>
          </div>}

        </div>

      </div>
    </div>
  </div>
}