import { useQuery, useQueryClient } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import { AxiosError } from "axios";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUnwrappedBinaryPublic, getUnwrappedPublicUserProfile } from "../../api/AppBinary";
import { AppBinary, instanceOfIpa } from "../../api/interfaces/response/app_binary";
import { useAuth } from "../../contexts/AuthProvider";
import PublicAboutIPA from "./components/PublicAboutIPA";

import { useState } from "react";
import QRCode from "react-qr-code";

function CreatedByUser({ id }: { id: string }) {

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(['publicUser', id], () => getUnwrappedPublicUserProfile(id));

  if (isLoading || isFetching) return <p className="text-gray-500 loading">Loading</p>

  return <div>{data?.username || data?.email || data?.name}</div>
}

export default function PublicBinaryPage() {
  // TODO: FUTURE: will be used when posting reviews and comments
  const { profile } = useAuth();

  const { binaryId } = useParams();

  const queryClient = useQueryClient();

  const [qrShown, setQRShown] = useState(false);

  const queryKey = ['publicBinary', binaryId, {
    authenticated: profile?.authenticated
  }];

  // binaryId will never be undefined because it's part of the path
  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery<AppBinary, AxiosError>(queryKey, () => getUnwrappedBinaryPublic(binaryId!!), {
      retry: false
    });

  // https://developer.apple.com/forums/thread/691873
  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Copied to clipboard.", {
      autoClose: 2000
    })
  }

  const toggleQRCode = () => {
    setQRShown(!qrShown)
  }

  if (isError) return <div className="min-h-full flex justify-center items-center">
    <div className="text-center">
      <h3 className="font-semibold text-4xl">An error occurred</h3>
      <p>{error?.message}</p>
    </div>
  </div>;

  if (data === undefined) {
    if (isLoading || isFetching) return <div className="mx-auto px-10">
      <h1 className={classNames("py-10", "subpixel-antialiased", "font-semibold", "text-5xl", "loading")}  >Loading</h1>
    </div>

    return <div className="min-h-full flex justify-center items-center">
      <div className="text-center">
        <h3 className="font-semibold text-4xl">An error occurred</h3>
        <p>No data was returned from the server.</p>
      </div>
    </div>;
  }

  const iconURL = `${process.env.REACT_APP_BASE_URL}storage/api/v1/app/binary/${data?.id}/icon`;

  const itmsPlistURL = `itms-services:///?action=download-manifest&url=${process.env.REACT_APP_BASE_URL}storage/api/v1/app/binary/${data?.id}/itmsplist`;

  let downloadURL = 'https://example.com';
  if (data.type === 'IPA') {
    downloadURL = itmsPlistURL;
  } else {
    // not implemented yet
  }

  return <div className="mx-auto px-10 mb-10" data-color-mode="light">
    <h1 className={classNames("pt-10", "subpixel-antialiased", "font-semibold", "text-5xl")}  >{data?.name}</h1>


    <div>
      <a target={"_blank"} href={iconURL}>
        <img className="inline-block max-w-[114px] rounded-3xl shadow-md my-5" src={iconURL} />
      </a>
    </div>


    <h3 className="font-semibold">Uploaded by</h3>
    {data?.userId && <CreatedByUser id={data.userId} />}

    {instanceOfIpa(data) && <PublicAboutIPA binary={data} />}

    <div className="flex flex-row gap-2">
      <button aria-label="copy to clipboard" type="button" onClick={copyURLToClipboard} className="border border-2 border-blue-700 font-semibold text-blue-700 hover:bg-blue-700 hover:text-white rounded-full px-3 py-1">
        Copy URL
      </button>
      <button aria-label="toggle QR code" onClick={toggleQRCode} type="button" className="border border-2 border-blue-700 font-semibold text-blue-700 hover:bg-blue-700 hover:text-white rounded-full px-3 py-1">
        {qrShown ? 'Hide' : 'Show'} QR code
      </button>
    </div>

    {qrShown && <div className="py-5 min-w-0 md:max-w-[256px] text-center">
      <QRCode
        size={256}
        className="inline-block"
        // style={{ height: "auto", maxWidth: "100%" }}
        value={window.location.href}
        viewBox={`0 0 256 256`}
      />
      <div contentEditable spellCheck={false} className="font-bold text-2xl">{data?.name}</div>
      <div contentEditable spellCheck={false}>{`Ver. ${data?.version} Build ${data?.build}`}</div>
    </div>}

    <a aria-label="tap here to install" target="_blank" href={downloadURL} type="button" className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-3xl text-white font-semibold px-6 py-3 my-5 rounded-full w-full md:w-auto inline-block text-center">
      Install
    </a>

    <h3 className="font-semibold text-4xl my-5">About this release</h3>
    {!data.description && <p className="text-gray-500">No description available.</p>}
    <div className="container" data-color-mode="light">
      <MDEditor.Markdown source={data.description} />
    </div>

  </div>
}