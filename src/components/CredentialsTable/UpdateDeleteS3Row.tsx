import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import classNames from "classnames";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateS3CredentialRequest } from "../../api/interfaces/request/update_s3_credential";
import { S3Credential } from "../../api/interfaces/response/storage_credential"
import { UpdateS3CredentialResponse } from "../../api/interfaces/response/update_s3_credential";
import { updateS3Credential } from "../../api/StorageCredentials";
import S3CredentialFields from "../../pages/ManageStorage/components/S3CredentialFields";
import { FtpFormInputs, S3FormInputs } from "../../pages/ManageStorage/interfaces/form_validation";

export default ({ s3_credential }: {
  s3_credential: S3Credential
}) => {

  const queryClient = useQueryClient();

  // updating
  const { isSuccess: mutationSuccess, error: mutationError, mutate: updateExistingS3Credential } = useMutation<AxiosResponse<UpdateS3CredentialResponse, any>, AxiosError, { id: string, req: UpdateS3CredentialRequest }>(({ id, req }: {
    id: string, req: UpdateS3CredentialRequest
  }) => {
    return updateS3Credential(id, req);
  }, {
    onSuccess: async () => {
      queryClient.invalidateQueries(['storage_creds']);
    }
  });


  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<S3FormInputs & FtpFormInputs>();
  const onSubmit: SubmitHandler<S3FormInputs> = data => {

    const { name, server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess } = data;

    updateExistingS3Credential({
      id: s3_credential.id, req: { name, server: awsRegion !== 'custom' ? '' : server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess }
    });
  }

  return <form onSubmit={handleSubmit(onSubmit)}>

    <div className={classNames('flex', 'flex-row', 'flex-wrap', 'gap-5', 'pb-5')}>
      <S3CredentialFields control={control}
        register={register}
        getValues={getValues}
        errors={errors} />

      <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end')}>
        <button type="submit" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Save</button>
      </div>

    </div>

  </form>
}