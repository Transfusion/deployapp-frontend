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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { changeEmail } from '../../../../api/Profile';
import SaveUnsuccessfulAlert from '../SaveUnsuccessfulAlert';
import SaveSuccessfulAlert from '../SaveSuccessfulAlert';
import { ChangeEmailRequest } from '../../../../api/interfaces/request/change_email_request';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';

interface EmailInputs {
  email: string
}

export default function EmailAccordion() {

  const [expanded, setExpanded] = useState(false);

  const { profile, isLoading: profileLoading, isFetching: profileFetching } = useAuth();

  const queryClient = useQueryClient();

  // updating
  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate } = useMutation<AxiosResponse<void, any>, AxiosError, ChangeEmailRequest>(req => {
    return changeEmail(req);
  }, {
    // this object is a MutateOptions
    // onSuccess: async () => {
    //   queryClient.invalidateQueries(['profile']);
    // }
  });


  const { control, getValues, register, handleSubmit, formState: { errors } } = useForm<EmailInputs>({
    defaultValues: { email: profile?.email }
  });

  const disableOperations = mutationLoading;

  const onSubmit: SubmitHandler<EmailInputs> = data => {
    mutate({ ...data, redirectBaseUrl: process.env.REACT_APP_OAUTH_REDIRECT_BASE_URL || window.location.origin });
  }

  return <>
    <Accordion expanded={expanded} onChange={() => { setExpanded(!expanded) }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Email
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>

          {
            profileLoading || profileFetching ? 'Loading...' :
              profile?.email
          }
        </Typography>

      </AccordionSummary>
      <AccordionDetails>

        <div className='pb-5'>

          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }}
            render={({ field }) =>
              <Input disabled={disableOperations} type="email" placeholder="john.doe@email.com" className={classNames({ "border-rose-500": errors.email })} {...field} /*className="border-rose-500"*/ />
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

        {mutationError && <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
          <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
          <div className="min-w-0">
            <p>Please wait at least 10 minutes before retrying.</p>
          </div>
        </div>}

        {mutationSuccess && <div className="bg-green-100 py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-full" role="alert">
          <BsCheckCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
          <div className="min-w-0">
            <p>Please check your inbox for the verification link.</p>
          </div>
        </div>}

      </AccordionDetails>
    </Accordion>

  </>
}