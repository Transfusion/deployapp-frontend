import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { getUnwrappedBinary } from "../../api/AppBinary";
import { AppBinary, instanceOfIpa } from "../../api/interfaces/response/app_binary";
import { useAuth } from "../../contexts/AuthProvider";
import AboutIPA from "./AboutIPA";
import IPAAssets from "./IPAAssets";

export default function EditBinaryPage() {
  // the API checks whether the user is authorized to access this page
  const { profile } = useAuth();

  const { binaryId } = useParams();

  const queryKey = ['binary', {
    authenticated: profile?.authenticated
  }];

  // binaryId will never be undefined because it's part of the path
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery<AppBinary, AxiosError>(queryKey, () => getUnwrappedBinary(binaryId!!), {
      retry: false
    });

  if (isError) return <div className="min-h-full flex justify-center items-center">
    <div className="text-center">
      <h3 className="font-semibold text-4xl">An error occurred</h3>
      <p>{error?.message}</p>
    </div>
  </div>;

  return <div className="mx-auto px-10">
    <h1 className={classNames("py-10", "subpixel-antialiased", "font-semibold", "text-5xl", { "loading": isLoading })}  >Editing {data?.name}</h1>

    {instanceOfIpa(data) && <AboutIPA binary={data} />}

    {/* Description */}

    <h3 className="font-semibold text-4xl">Assets</h3>
    {/* notably, public icon, plist and icons download in a zip */}
    {instanceOfIpa(data) && <IPAAssets binary={data} />}

    {/* <h3 className="font-semibold text-4xl">Info</h3> */}

    {/* core info */}
    {/* expanding panel to show two column */}

    <h3 className="font-semibold text-4xl">About</h3>

    <h3 className="font-semibold text-4xl">Pending Jobs</h3>

    <p className="text-gray-500">All clear!</p>

    <h3 className="font-semibold text-4xl">Settings</h3>
    {/* visible, timeframe */}

    {/* delete button */}
  </div>
}