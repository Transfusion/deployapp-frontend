import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import classNames from "classnames";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { Input } from "rsuite";
import { UpdateS3CredentialRequest } from "../../api/interfaces/request/update_s3_credential";
import { S3Credential } from "../../api/interfaces/response/storage_credential";
import { UpdateS3CredentialResponse } from "../../api/interfaces/response/update_s3_credential";
import { deleteStorageCredential, updateS3Credential } from "../../api/StorageCredentials";
import S3CredentialFields from "../../pages/ManageStorage/components/S3CredentialFields";
import UpdateSuccessfulAlert from "../../pages/ManageStorage/components/UpdateSuccessfulAlert";
import UpdateUnsuccessfulAlert from "../../pages/ManageStorage/components/UpdateUnsuccessfulAlert";
import { FtpFormInputs, S3FormInputs } from "../../pages/ManageStorage/interfaces/form_validation";

export default ({ s3_credential, onSuccess, onDeleteSuccess }: {
  s3_credential: S3Credential,
  // type taken from MutateOptions
  onSuccess?: ((data: AxiosResponse<UpdateS3CredentialResponse, any>, variables: {
    id: string;
    req: UpdateS3CredentialRequest;
  }, context: unknown) => void | Promise<unknown>) | undefined

  onDeleteSuccess?: ((data: AxiosResponse<void, any>, variables: string, context: unknown) => void | Promise<unknown>) | undefined
}) => {


  // deleting
  const { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError, mutate: deleteExistingStorageCredential } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
    return deleteStorageCredential(id);
  }, {
    // this object is a MutateOptions
    onSuccess: onDeleteSuccess
  });


  // updating
  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: updateExistingS3Credential } = useMutation<AxiosResponse<UpdateS3CredentialResponse, any>, AxiosError, { id: string, req: UpdateS3CredentialRequest }>(({ id, req }: {
    id: string, req: UpdateS3CredentialRequest
  }) => {
    return updateS3Credential(id, req);
  }, {
    // this object is a MutateOptions
    onSuccess
  });

  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<S3FormInputs & FtpFormInputs>({
    defaultValues: s3_credential
  });

  const onSubmit: SubmitHandler<S3FormInputs> = data => {

    const { name, server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess } = data;

    updateExistingS3Credential({
      id: s3_credential.id, req: { name, server: awsRegion !== 'custom' ? '' : server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess }
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

        <S3CredentialFields control={control}
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
        onClick={() => { deleteExistingStorageCredential(s3_credential.id) }}
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