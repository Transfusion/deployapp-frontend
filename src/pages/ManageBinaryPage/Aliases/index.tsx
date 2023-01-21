import PlusIcon from '@rsuite/icons/Plus';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import _ from "lodash";
import { toast } from "react-toastify";
import { Input, InputGroup } from "rsuite";
import { deleteAppBinaryAlias, getUnwrappedAppBinaryAliases, shorten } from "../../../api/AppBinaryAlias";

type AliasesProps = { appBinaryId: string };

export default function Aliases(props: AliasesProps) {

  const queryClient = useQueryClient();

  const { appBinaryId: id } = props;
  const queryKey = ['aliases', id];

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(queryKey, () => getUnwrappedAppBinaryAliases(id));

  // should never fail
  const { isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError, mutate: performShorten } = useMutation<AxiosResponse<void, any>, AxiosError, string>(req => {
    return shorten(req);
  }, {
    // this object is a MutateOptions
    onSuccess: async () => {
      queryClient.invalidateQueries(queryKey);
    }
  });

  // individual alias
  function Alias({ appBinaryId, alias }: { appBinaryId: string, alias: string }) {

    const fullURL = `${process.env.REACT_APP_OAUTH_REDIRECT_BASE_URL}/a/${alias}`;
    // const queryKey = ['aliases', appBinaryId];

    const { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError, mutate: performDelete } = useMutation<AxiosResponse<void, any>, AxiosError, void>(() => deleteAppBinaryAlias(appBinaryId, alias)
      , {
        // this object is a MutateOptions
        onSuccess: async () => {
          queryClient.invalidateQueries(queryKey)
        }
      });

    const copyURLToClipboard = () => {
      navigator.clipboard.writeText(fullURL);
      toast("Copied to clipboard.", {
        autoClose: 2000
      })
    }

    const disableOperations = deleteLoading || isLoading || isFetching;

    return <div className="flex flex-row items-center justify-center gap-2 pb-5">

      <div className="flex-grow">
        <a target="_blank" className="my-auto font-mono inline-block hover:underline text-blue-700" href={fullURL}>{alias}</a>
      </div>

      <button type="button" onClick={copyURLToClipboard} className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Copy
      </button>

      <button disabled={disableOperations} onClick={() => { performDelete(); }} type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
        Delete
      </button>

    </div>
  }
  // individual alias end

  if (isLoading /*|| isFetching */) return <p className="text-gray-500 loading">Loading</p>

  return <div className="w-full sm:max-w-md">
    {_.isEmpty(data) && <p className="text-gray-500">No aliases.</p>}
    {data?.map(({ alias }) =>
      <Alias
        appBinaryId={id}
        alias={alias} />)}

    <InputGroup >
      <Input
        // {...field}
        // disabled={awsRegion !== 'custom'}
        // value={awsRegion === 'custom' ? field.value : ''}
        disabled
        placeholder="your-alias" />
      <InputGroup.Button disabled={mutationLoading} className="disabled:bg-gray-500 bg-blue-500"
        onClick={() => { performShorten(id); }}>
        <PlusIcon className="text-white" />
      </InputGroup.Button>
    </InputGroup>
  </div>
}