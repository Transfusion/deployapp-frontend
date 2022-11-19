import classNames from "classnames";
import { useState } from "react";
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";

import XMLViewer from 'react-xml-viewer';

export function ManifestPanel({ manifestXml }: { manifestXml: String }) {
  const [expanded, setExpanded] = useState(false);

  const ToggleIcon = expanded ? BsFillArrowUpCircleFill : BsFillArrowDownCircleFill;


  return <div className="py-3">
    <div className={classNames("grid grid-cols-2 mu-5 overflow-scroll", {
      "max-h-48": !expanded
    })}>
      <XMLViewer className="font-mono text-sm" collapsible indentSize={4} xml={manifestXml} />
    </div>

    <div onClick={() => { setExpanded(!expanded) }} className="cursor-pointer shadow flex flex-row items-center justify-center gap-2">  <span>click to {expanded ? 'shrink' : 'expand'}</span>  <ToggleIcon /> </div>
  </div>

}