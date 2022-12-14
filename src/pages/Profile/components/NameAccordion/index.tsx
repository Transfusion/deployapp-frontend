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

interface NameInputs {
  name?: string
}

export default function NameAccordion() {

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


  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<NameInputs>({
    defaultValues: { name: profile?.name }
  });

  const disableOperations = mutationLoading;

  const onSubmit: SubmitHandler<NameInputs> = data => {
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
          Name
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>

          {
            profileLoading || profileFetching ? 'Loading...' :
              profile?.name ?? 'No name set'
          }
        </Typography>

      </AccordionSummary>
      <AccordionDetails>

        <div className='pb-5'>

          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) =>
              <Input disabled={disableOperations} className={classNames({ "border-rose-500": errors.name })} {...field} placeholder="Your Name" /*className="border-rose-500"*/ />
            }
          />

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