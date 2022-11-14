import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "rsuite";
import { UpdateFtpCredentialRequest } from "../../api/interfaces/request/update_ftp_credential";
import { FtpCredential } from "../../api/interfaces/response/storage_credential";
import { UpdateFtpCredentialResponse } from "../../api/interfaces/response/update_ftp_credential";
import { deleteS3Credential, updateFtpCredential } from "../../api/StorageCredentials";
import FtpCredentialFields from "../../pages/ManageStorage/components/FtpCredentialFields";
import UpdateSuccessfulAlert from "../../pages/ManageStorage/components/UpdateSuccessfulAlert";
import UpdateUnsuccessfulAlert from "../../pages/ManageStorage/components/UpdateUnsuccessfulAlert";
import { S3FormInputs, FtpFormInputs } from "../../pages/ManageStorage/interfaces/form_validation";


export default ({ ftp_credential, onSuccess, onDeleteSuccess }: {
  ftp_credential: FtpCredential,
  // type taken from MutateOptions
  onSuccess?: ((data: AxiosResponse<UpdateFtpCredentialResponse, any>, variables: {
    id: string;
    req: UpdateFtpCredentialRequest;
  }, context: unknown) => void | Promise<unknown>) | undefined

  onDeleteSuccess?: ((data: AxiosResponse<void, any>, variables: string, context: unknown) => void | Promise<unknown>) | undefined
}) => {

  // deleting
  const { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError, mutate: deleteExistingStorageCredential } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
    return deleteS3Credential(id);
  }, {
    // this object is a MutateOptions
    onSuccess: onDeleteSuccess
  });


  // updating
  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: updateExistingS3Credential } = useMutation<AxiosResponse<UpdateFtpCredentialResponse, any>, AxiosError, { id: string, req: UpdateFtpCredentialRequest }>(({ id, req }: {
    id: string, req: UpdateFtpCredentialRequest
  }) => {
    return updateFtpCredential(id, req);
  }, {
    // this object is a MutateOptions
    onSuccess
  });

  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<S3FormInputs & FtpFormInputs>({
    defaultValues: ftp_credential
  });


  const onSubmit: SubmitHandler<FtpFormInputs> = data => {
    updateExistingS3Credential({
      id: ftp_credential.id, req: data
    });
  }

  const disableOperations = mutationLoading || deleteLoading;


  return <>

    <form>
      <div className={classNames('flex', 'flex-row', 'flex-wrap', 'gap-5', 'pb-5')}>
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

        <FtpCredentialFields control={control}
          register={register}
          getValues={getValues}
          errors={errors} />

        {mutationError && <UpdateUnsuccessfulAlert error={mutationError} />}
        {mutationSuccess && <UpdateSuccessfulAlert />}
      </div>

    </form>


    {/* https://stackoverflow.com/questions/66176755/react-js-multiple-submit-buttons-react-hook-form */}
    <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end', 'gap-5')}>
      <button disabled={disableOperations}
        onClick={() => { deleteExistingStorageCredential(ftp_credential.id) }}
        className={classNames('text-base', 'text-red-700', 'hover:text-white', 'border-2', 'border-red-700', 'hover:bg-red-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-red-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Delete</button>

      <button disabled={disableOperations}
        onClick={handleSubmit(onSubmit)}
        className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Save</button>
    </div>
  </>
}