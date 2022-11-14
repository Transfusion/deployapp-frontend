import classNames from "classnames"
import { Control, UseFormRegister, UseFormGetValues, FieldErrorsImpl, DeepRequired, Controller } from "react-hook-form"
import { Input, InputNumber, InputGroup } from "rsuite"
import { S3FormInputs, FtpFormInputs } from "../../interfaces/form_validation"

export default function FtpCredentialFields({ control, register, getValues, errors }: {
  control: Control<S3FormInputs & FtpFormInputs, any>,
  register: UseFormRegister<S3FormInputs & FtpFormInputs>,
  getValues: UseFormGetValues<S3FormInputs & FtpFormInputs>,
  errors: FieldErrorsImpl<DeepRequired<S3FormInputs & FtpFormInputs>>
}) {
  return <>
    <div>
      <p className="text-base font-semibold">Server *</p>

      <Controller
        name="server"
        control={control}
        defaultValue=""
        // only have to enter the endpoint if custom; or else the backend
        // will determine based on the region code
        rules={{ required: true }}
        render={({ field }) =>
          <InputGroup
            className={classNames({ "border-rose-500": errors.server })} >
            <InputGroup.Addon>ftp://</InputGroup.Addon>

            <Input {...field} placeholder="ftp.example.com" className={classNames({ "border-rose-500": errors.server })} />
          </InputGroup>
        }
      />
    </div>


    <div>
      <p className="text-base font-semibold">Port *</p>

      <Controller
        name="port"
        control={control}
        defaultValue={21}
        rules={{ required: true }}
        render={({ field }) =>
          <InputNumber {...field} max={65535} min={1} placeholder="21" className={classNames({ "border-rose-500": errors.port })} />
        } />
    </div>

    <div>
      <p className="text-base font-semibold">Username *</p>

      <Controller
        name="username"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="username" className={classNames({ "border-rose-500": errors.username })} />
        } />
    </div>

    <div>
      <p className="text-base font-semibold">Password *</p>

      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="password" className={classNames({ "border-rose-500": errors.username })} />
        } />
    </div>

    <div className="min-w-[210px]">
      <p className="text-base font-semibold">Directory *</p>

      <Controller
        name="directory"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="public_html/foobar" className={classNames({ "border-rose-500": errors.directory })} />
        } />

    </div>

    <div className="min-w-[315px]">
      <p className="text-base font-semibold">Base URL *</p>

      <Controller
        name="baseUrl"
        control={control}
        defaultValue=""
        rules={{ required: true }}
        render={({ field }) =>
          <Input {...field} placeholder="https://public.example.com/foobar" className={classNames({ "border-rose-500": errors.baseUrl })} />
        } />

    </div>

  </>
}