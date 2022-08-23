import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

import { Table, Column, HeaderCell, Cell } from 'rsuite-table';

import { createS3Credential, getStorageCredentials } from "../../api/StorageCredentials";
import { useAuth } from "../../contexts/AuthProvider";
import classNames from "classnames";

import { BsExclamationCircle, BsPlusCircleFill } from "react-icons/bs";
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


const CustomHeaderCell = styled(HeaderCell).attrs({
  className: 'text-sm'
})``;

const CustomCell = styled(Cell).attrs({
  className: 'text-base'
})``;

const humanReadableDate = (d?: Date): string => {
  if (!d) return "Never";
  return new Date(d).toLocaleString();
}

const STORAGE_TYPE_DATA = /*Object.entries(STORAGE_TYPES)*/[['S3', 'S3'] as [string, string]].map(
  ([label, value]: [string, string]) => ({ label, value })
);

const size = 15;
export default function ManageStorage() {
  const [page, setPage] = useState(0);
  const { profile } = useAuth();

  // TODO: implement organization
  const [organization, setOrganization] = useState(null);

  // add credentials section
  const [showAddCredentials, setShowAddCredentials] = useState(false);
  const [addCredentialsType, setAddCredentialsType] = useState(STORAGE_TYPES.S3);

  const queryClient = useQueryClient();

  const queryKey = ['storage_creds', {
    page,
    size,
    organization,
    authenticated: profile?.authenticated
  }];

  // fetching
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getStorageCredentials(page, size));


  // updating
  const { isLoading: mutationIsLoading, isError: mutationIsError, isSuccess: mutationSuccess, error: mutationError, mutate: addNewS3Credential } = useMutation<AxiosResponse<CreateS3CredentialResponse, any>, AxiosError, CreateS3CredentialRequest>((req: CreateS3CredentialRequest) => {
    return createS3Credential(req);
  }, {
    // req is the return type of the previous function 
    onSuccess: async (resp) => {
      queryClient.invalidateQueries(queryKey);
    }
  });


  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<S3FormInputs & FtpFormInputs>();
  const onSubmit: SubmitHandler<S3FormInputs & FtpFormInputs> = data => {
    if (addCredentialsType === STORAGE_TYPES.S3) {
      const { name, server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess } = data;
      addNewS3Credential({ name, server: awsRegion !== 'custom' ? '' : server, awsRegion, accessKey, secretKey, bucket, skipTestPublicAccess });
    } else {
      // TODO
    }
  }

  return <div className="mx-auto px-10">
    <h1 className="py-10 subpixel-antialiased font-semibold text-5xl">Storage</h1>

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
      </div>

      {mutationError && <CreateUnsuccessfulAlert error={mutationError} />}
      {mutationSuccess && <CreateSuccessfulAlert />}

      <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end')}>
        <button type="submit" className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Save</button>
      </div>

    </form>}


    <Table
      loading={isLoading}
      data={data?.data.content}
      height={400}
      showHeader={true}
      onRowClick={rowData => {
        console.log(rowData);
      }}>

      <Column width={60} align="center" fixed>
        <CustomHeaderCell className="text-sm">Type</CustomHeaderCell>
        <CustomCell dataKey="type" />
      </Column>

      <Column width={150}>
        <CustomHeaderCell>Name</CustomHeaderCell>
        <CustomCell dataKey="name" />
      </Column>

      <Column width={200} resizable>
        <CustomHeaderCell>Created On</CustomHeaderCell>
        <CustomCell dataKey="createdOn">{rowData => humanReadableDate(rowData.createdOn)}</CustomCell>
      </Column>

      <Column width={200} resizable>
        <CustomHeaderCell>Checked On</CustomHeaderCell>
        <CustomCell dataKey="checkedOn">{rowData => humanReadableDate(rowData.checkedOn)}</CustomCell>
      </Column>

      <Column width={200} resizable>
        <CustomHeaderCell>Last Used</CustomHeaderCell>
        <CustomCell dataKey="lastUsed">{rowData => humanReadableDate(rowData.lastUsed)}</CustomCell>
      </Column>

      {/* <Column width={100}>
        <HeaderCell>Gender</HeaderCell>
        <Cell dataKey="gender" />
      </Column> */}

    </Table>

  </div>
}