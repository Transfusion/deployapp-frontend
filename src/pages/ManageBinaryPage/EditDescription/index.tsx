import { useMutation } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import { AxiosError, AxiosResponse } from 'axios';
import classNames from 'classnames';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateAppBinaryDescription } from '../../../api/AppBinary';
import { AppBinary } from '../../../api/interfaces/response/app_binary';
import CreateSuccessfulAlert from './components/CreateSuccessfulAlert';

type Description = {
  description: string,
}

export default function EditDescription({ binary }: { binary: AppBinary }) {

  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<Description>({
    defaultValues: { description: binary.description }
  });

  const { isLoading, isSuccess, error, mutate: updateDescription } = useMutation<AxiosResponse<AppBinary, any>, AxiosError, { id: string, req: string }>(({ id, req }: {
    id: string, req: string
  }) => {
    return updateAppBinaryDescription(id, req);
  }, {
    // this object is a MutateOptions
    // onSuccess
  });


  const onSubmit: SubmitHandler<Description> = data => {
    const { description } = data;
    updateDescription({ id: binary.id, req: description });
  }

  return <form>

    <Controller
      name="description"
      control={control}
      // defaultValue=""
      rules={{ required: true }}
      render={({ field }) =>
        <MDEditor
          className={classNames({
            'border-2 border-red-500': errors.description
          })}
          height={400}
          value={field.value}
          onChange={value => field.onChange(value)}
        />
      }
    />

    <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end', 'gap-5')}>

      <button
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
        className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
          // 'mr-2', 'mb-2',
          // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

        )}>Save</button>
    </div>

    {isSuccess && <CreateSuccessfulAlert />}


  </form>

}