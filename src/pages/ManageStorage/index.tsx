import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createFtpCredential, createS3Credential } from "../../api/StorageCredentials";
import classNames from "classnames";

import { BsPlusCircleFill } from "react-icons/bs";
import { Input, SelectPicker } from "rsuite";
import { STORAGE_TYPES } from "../../utils/constants";

import S3CredentialFields from "./components/S3CredentialFields";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { S3FormInputs, FtpFormInputs } from "./interfaces/form_validation";
import { CreateS3CredentialRequest } from "../../api/interfaces/request/create_s3_credential";
import { AxiosResponse, AxiosError } from "axios";
import { CreateS3CredentialResponse } from "../../api/interfaces/response/create_s3_credential";
import CreateUnsuccessfulAlert from "./components/CreateUnsuccessfulAlert";
import CreateSuccessfulAlert from "./components/CreateSuccessfulAlert";
import CredentialsTable from "../../components/CredentialsTable";
import FtpCredentialFields from "./components/FtpCredentialFields";
import { CreateFtpCredentialRequest } from "../../api/interfaces/request/create_ftp_credential";
import { CreateFtpCredentialResponse } from "../../api/interfaces/response/create_ftp_credential";
import Footer from "../../components/Footer";

const STORAGE_TYPE_DATA = Object.entries(STORAGE_TYPES).map(
  ([label, value]: [string, string]) => ({ label, value })
);

export default function ManageStorage() {

  // add credentials section
  const [showAddCredentials, setShowAddCredentials] = useState(false);
  const [addCredentialsType, setAddCredentialsType] = useState(STORAGE_TYPES.S3);

  const queryClient = useQueryClient();

  // updating
  const { isLoading: addS3Loading, isSuccess: addS3Success, error: addS3Error, mutate: addNewS3Credential } = useMutation<AxiosResponse<CreateS3CredentialResponse, any>, AxiosError, CreateS3CredentialRequest>((req: CreateS3CredentialRequest) => {
    return createS3Credential(req);
  }, {
    // req is the return type of the previous function 
    onSuccess: async () => {
      queryClient.invalidateQueries(['storage_creds']);
      queryClient.invalidateQueries(['profile']);
    }
  });


  const { isLoading: addFtpLoading, isSuccess: addFtpSuccess, error: addFtpError, mutate: addNewFtpCredential } = useMutation<AxiosResponse<CreateFtpCredentialResponse, any>, AxiosError, CreateFtpCredentialRequest>((req: CreateFtpCredentialRequest) => {
    return createFtpCredential(req);
  }, {
    // req is the return type of the previous function 
    onSuccess: async () => {
      queryClient.invalidateQueries(['storage_creds']);
      queryClient.invalidateQueries(['profile']);
    }
  });


  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<S3FormInputs & FtpFormInputs>();
  const onSubmit: SubmitHandler<S3FormInputs & FtpFormInputs> = data => {
    if (addCredentialsType === STORAGE_TYPES.S3) {
      const { name, server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess } = data;
      addNewS3Credential({ name, server: awsRegion !== 'custom' ? '' : server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess });
    } else {
      const { name, server, port, username, password, directory, baseUrl } = data;
      addNewFtpCredential({ name, server, port, username, password, directory, baseUrl });
    }
  }


  const mutationLoading = addS3Loading || addFtpLoading;
  const mutationSuccess = addS3Success || addFtpSuccess;
  const mutationError = addS3Error || addFtpError;

  return <div className="mx-auto md:px-10 px-5">
    <h1 className="pt-20 pb-10 subpixel-antialiased font-semibold text-5xl">Storage</h1>

    <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end')}>
      <button onClick={() => setShowAddCredentials(!showAddCredentials)} type="button" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}><BsPlusCircleFill className="inline-block mr-2" size={'1.5em'} />Add Credential</button>
    </div>

    {showAddCredentials && <form onSubmit={handleSubmit(onSubmit)}>
      {/* the entire add credentials box */}
      <div className={classNames('flex', 'flex-row', 'flex-wrap', 'gap-5', 'pb-5')}>

        {/* storage type dropdown (s3, ftp, etc) */}
        <div className="shrink-0 w-fit">
          <h2 className="text-base font-semibold w-fit">Storage type</h2>

          <SelectPicker
            className={'min-w-[100px]'}
            data={STORAGE_TYPE_DATA}
            value={addCredentialsType}
            onSelect={(value) => { setAddCredentialsType(value); }}
            // onSelect	(value: ValueType, item: ItemDataType, event) => void
            cleanable={false}
          />
        </div>

        <div className="min-w-[100px]">
          <p className="text-base font-semibold">Name *</p>

          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => <Input className={classNames({ "border-rose-500": errors.name })} {...field} placeholder="A descriptive name" /*className="border-rose-500"*/ />}
          />

        </div>

        {/* type-specific fields */}
        {addCredentialsType === STORAGE_TYPES.S3 && <S3CredentialFields control={control}
          register={register}
          getValues={getValues}
          errors={errors} />}

        {addCredentialsType === STORAGE_TYPES.FTP && <FtpCredentialFields control={control}
          register={register}
          getValues={getValues}
          errors={errors} />}
      </div>

      {mutationError && <CreateUnsuccessfulAlert error={mutationError} />}
      {mutationSuccess && <CreateSuccessfulAlert />}

      <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end')}>
        <button disabled={mutationLoading} className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Save</button>
      </div>

    </form>}
    <CredentialsTable enableEditing />

    <Footer />
  </div>
}