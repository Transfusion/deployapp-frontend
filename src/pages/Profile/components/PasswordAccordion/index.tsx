import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { Input } from "rsuite";

import { Typography } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../contexts/AuthProvider';
import { PatchProfileRequest } from '../../../../api/interfaces/request/patch_profile';
import Profile from '../../../../api/interfaces/response/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { patchProfile } from '../../../../api/Profile';
import SaveUnsuccessfulAlert from '../SaveUnsuccessfulAlert';
import SaveSuccessfulAlert from '../SaveSuccessfulAlert';

interface PasswordInputs {
  password: string,
  confirmPassword: string,
}

export default function PasswordAccordion() {

  const [expanded, setExpanded] = useState(false);

  const { profile, isLoading: profileLoading, isFetching: profileFetching } = useAuth();

  const queryClient = useQueryClient();

  // updating
  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: updateProfile } = useMutation<AxiosResponse<Profile, any>, AxiosError, PatchProfileRequest>(req => {
    return patchProfile(req);
  }, {
    // this object is a MutateOptions
    onSuccess: async () => {
      queryClient.invalidateQueries(['profile']);
    }
  });


  const { watch, control, getValues, register, handleSubmit, formState: { errors } } = useForm<PasswordInputs>({
    // defaultValues: { username: profile?.username }
  });

  const password = watch("password");

  const disableOperations = mutationLoading;

  const onSubmit: SubmitHandler<PasswordInputs> = data => {
    updateProfile(data)
  }

  return <>
    <Accordion expanded={expanded} onChange={() => { setExpanded(!expanded) }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Password
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>

          {
            profileLoading || profileFetching ? 'Loading...' :
              profile?.has_password ? 'Password set' : 'No password set'
          }
        </Typography>

      </AccordionSummary>
      <AccordionDetails>

        <div className='pb-5'>

          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input disabled={disableOperations} type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.password })} {...field} />} />


          <label className="font-semibold text-sm text-gray-600 pb-1 block">Confirm Password</label>

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: true,
              validate: value => value === password || "The passwords do not match"
            }}
            render={({ field }) => <Input disabled={disableOperations} type="password" className={classNames("border  px-3 py-2 mt-1 mb-5 text-sm w-full", { "border-rose-500": errors.confirmPassword })} {...field} />} />


        </div>

        <div className={classNames('pb-5', 'flex', 'flex-row', 'justify-end', 'gap-5')}>

          <button disabled={disableOperations}
            onClick={handleSubmit(onSubmit)}
            className={classNames('text-base', 'text-blue-700', 'hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
              // 'mr-2', 'mb-2',
              // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

            )}>Save</button>
        </div>

        {mutationError && <SaveUnsuccessfulAlert error={mutationError} />}

        {mutationSuccess && <SaveSuccessfulAlert />}

      </AccordionDetails>
    </Accordion>

  </>
}