import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { getUnwrappedApkCerts } from "../../../../../api/AppBinary";
import { ApkCert } from "../../../../../api/interfaces/response/apk_cert";
import { InfoCell } from "../../../../../components/InfoCell";
import { humanReadableDate } from "../../../../../utils/utils";

function CertficatePanel({ cert, idx }: { cert: ApkCert, idx: number }) {

  return <div className="py-3">
    <div className="text-xl font-bold">{`#${idx}`}</div>

    <div className="flex flex-row flex-wrap gap-3 p-2 mb-5 border border-gray-800">
      <InfoCell title={"Subject"} value={cert.subject} />
      <InfoCell title={"Issuer"} value={cert.issuer} />
      <InfoCell title={"Path"} value={cert.path} />
      <InfoCell title={"Not Before"} value={humanReadableDate(cert.notBefore)} />
      <InfoCell title={"Not After"} value={humanReadableDate(cert.notAfter)} />
    </div>
  </div>
}

export default function CertificateDetails({ id }: {
  id: string
}) {

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(['apkcert', id], () => getUnwrappedApkCerts(id));

  if (isLoading || isFetching) return <p className="text-gray-500 loading">Loading</p>

  if (_.isEmpty(data)) return <p className="text-gray-500">Not available.</p>


  return <>{data?.map((cert, idx) => <CertficatePanel key={cert.id} idx={idx} cert={cert} />)}</>;
}