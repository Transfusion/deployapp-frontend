import classNames from "classnames";
import { useState } from "react";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";

export function InfoPlistPanel({ plist }: { plist: Object }) {

  const [expanded, setExpanded] = useState(false);

  const ToggleIcon = expanded ? BsFillArrowUpCircleFill : BsFillArrowDownCircleFill;

  return <div className="py-3">
    <div className={classNames("grid grid-cols-2 mu-5 overflow-scroll", {
      "max-h-48": !expanded
    })}>
      {Object.entries(plist).map(([l, r]) =>
        <>
          <div key={l} className="font-semibold break-all border-solid border-b-2 border-gray-400">{l}</div>
          <div className="break-all border-solid border-b-2 border-gray-400">{JSON.stringify(r)}</div>
        </>
      )}
    </div>

    <div onClick={() => { setExpanded(!expanded) }} className="cursor-pointer shadow flex flex-row items-center justify-center gap-2">  <span>click to {expanded ? 'shrink' : 'expand'}</span>  <ToggleIcon /> </div>
  </div>
}
