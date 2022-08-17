import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { Control, Controller, DeepRequired, FieldErrorsImpl, UseFormGetValues, UseFormRegister, useWatch } from 'react-hook-form';
import { InputGroup, SelectPicker } from 'rsuite';
import Input from 'rsuite/Input';
import { getS3Regions } from '../../../../api/StorageCredentials';
import { S3FormInputs, FtpFormInputs } from '../../interfaces/form_validation';

import S3RegionsResponse from "../../../../api/interfaces/response/s3_regions_response";

export default function S3CredentialFields({ control, register, getValues, errors }: {
  control: Control<S3FormInputs & FtpFormInputs, any>,
  register: UseFormRegister<S3FormInputs & FtpFormInputs>,
  getValues: UseFormGetValues<S3FormInputs & FtpFormInputs>,
  errors: FieldErrorsImpl<DeepRequired<S3FormInputs & FtpFormInputs>>
}) {

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery([true], () => getS3Regions());

  const custom_item = [{ "isGlobalRegion": false, "id": "custom", "description": "Custom endpoint (e.g. Minio, GCP)" }] as S3RegionsResponse;

  const S3_REGIONS = custom_item.concat(data?.data as S3RegionsResponse || [] as S3RegionsResponse);

  const awsRegion = useWatch({
    control,
    name: "awsRegion", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: "default" // default value before the render
  });

  return <>

    {/* aws region */}

    <div>
      <p className="text-base font-semibold">AWS Region *</p>

      <Controller
        name="awsRegion"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <SelectPicker
            className={classNames('custom-selectpicker', 'min-w-[100px]', { "border-rose-500": errors.awsRegion })}
            data={S3_REGIONS.map(({ description, id }) => ({ label: description, value: id }))}
            value={field.value}
            onSelect={(value) => { field.onChange(value); }}
            // onSelect	(value: ValueType, item: ItemDataType, event) => void
            cleanable={false}
          />
        }
      />
    </div>




    <div>
      <p className="text-base font-semibold">Server</p>
      {/* <input className="border-blue-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" /> */}

      <Controller
        name="server"
        control={control}
        defaultValue=""
        // only have to enter the endpoint if custom; or else the backend
        // will determine based on the region code
        rules={{ required: awsRegion === 'custom' }}
        render={({ field }) =>
          <InputGroup className={classNames({ "border-rose-500": errors.server })} >
            <InputGroup.Addon>https://</InputGroup.Addon>
            <Input {...field}
              disabled={awsRegion !== 'custom'}
              value={awsRegion === 'custom' ? field.value : ''}
              placeholder="s3.amazonaws.com" />
          </InputGroup>
        }
      />
    </div>

    <div className="min-w-[210px]">
      <p className="text-base font-semibold">Access Key *</p>

      <Controller
        name="accessKey"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) => <Input {...field} placeholder="AKIAIOSFODNN7EXAMPLE" className={classNames({ "border-rose-500": errors.accessKey })} />} />
    </div>

    <div className="min-w-[210px]">
      <p className="text-base font-semibold">Secret Key *</p>

      <Controller
        name="secretKey"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" className={classNames({ "border-rose-500": errors.secretKey })} />
        } />
    </div>

    <div>
      <p className="text-base font-semibold">Bucket Name *</p>

      <Controller
        name="bucket"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="sample_bucket" className={classNames({ "border-rose-500": errors.bucket })} />
        } />
    </div>


    <div>
      <label className="inline-flex items-center">
        <input {...register('skipTestPublicAccess')} className="form-checkbox w-7 h-7 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
        <p className="text-base font-semibold">Skip testing public prefix</p>  
      </label>

      <p className="text-slate-600">Please ensure that the <span className="font-mono">public/</span> prefix of your bucket is publicly accessible.</p>

    </div>

  </>
}