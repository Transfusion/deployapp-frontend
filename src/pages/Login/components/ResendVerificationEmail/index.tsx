import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ResendVerificationRequest } from "../../../../api/interfaces/request/resend_verification_request";
import { ResendVerificationResult } from "../../../../api/interfaces/response/resend_verification";
import { resendVerification } from "../../../../api/Profile";
import { ResendVerificationFormInputs } from "../../../ManageStorage/interfaces/form_validation";


export default function ResendVerificationEmail({ email }: { email: string }) {

  const [existingEmail, setExistingEmail] = useState<string | undefined>(undefined);

  const originalEmail = existingEmail || email;

  const { watch, control, getValues, register, handleSubmit, formState: { errors } } = useForm<ResendVerificationFormInputs>({
    defaultValues: { newEmail: originalEmail }
  });

  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: resend } = useMutation<AxiosResponse<ResendVerificationResult, any>, AxiosError<ResendVerificationResult, any>, ResendVerificationRequest>(req => {
    return resendVerification(req);
  }, {
    // this object is a MutateOptions
    onSuccess: () => { setExistingEmail(getValues('newEmail')) }
  });

  const disableInputs = mutationLoading;

  const onSubmit: SubmitHandler<ResendVerificationFormInputs> = data => {
    resend({ email: originalEmail, ...data, redirectBaseUrl: process.env.REACT_APP_OAUTH_REDIRECT_BASE_URL || window.location.origin });
  }


  return <>
    <Controller
      name="newEmail"
      control={control}
      rules={{
        required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      }}
      render={({ field }) =>
        <input disabled={disableInputs} type="email" placeholder="john.doe@email.com" className={classNames("border  px-3 py-2 mt-1 mb-2 text-sm w-full", { "border-rose-500": errors.newEmail })} {...field} />} />

    <button onClick={handleSubmit(onSubmit)} className="inline-block underline font-bold cursor-pointer">Resend email</button>

    {mutationSuccess && <p>Email resent.</p>}
    {mutationError && <p>Please wait at least 10 minutes before retrying.</p>}

  </>
}