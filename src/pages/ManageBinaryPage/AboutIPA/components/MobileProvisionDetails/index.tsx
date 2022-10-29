import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useState } from "react";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { getUnwrappedMobileprovisions } from "../../../../../api/AppBinary";

function MobileProvisionPanel({ mob, idx }: { mob: object, idx: number }) {

  const [expanded, setExpanded] = useState(false);

  const ToggleIcon = expanded ? BsFillArrowUpCircleFill : BsFillArrowDownCircleFill;

  return <div className="py-3">
    <div className="text-xl font-bold">{`#${idx}`}</div>
    <div className={classNames("grid grid-cols-2 mu-5 overflow-scroll", {
      "max-h-48": !expanded
    })}>
      {Object.entries(mob).map(([l, r]) =>
        <>
          <div className="font-semibold border-solid border-b-2 border-gray-400">{l}</div>
          <div className="border-solid border-b-2 border-gray-400">{JSON.stringify(r)}</div>
        </>
      )}
    </div>

    <div onClick={() => { setExpanded(!expanded) }} className="cursor-pointer shadow flex flex-row items-center justify-center gap-2">  <span>click to {expanded ? 'shrink' : 'expand'}</span>  <ToggleIcon /> </div>
  </div>
}

export default function MobileProvisionDetails({ id }: {
  id: string
}) {

  const { isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData, } = useQuery(['mobileprovision', id], () => getUnwrappedMobileprovisions(id));

  if (isLoading || isFetching) return <p className="text-gray-500 loading">Loading</p>

  if (data?.length == 0) return <p className="text-gray-500">Not available.</p>

  return <>{data?.map((mob, idx) => <MobileProvisionPanel key={mob.id} idx={idx} mob={mob} />)}</>;
}