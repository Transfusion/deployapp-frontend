import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUnwrappedAppBinaryAlias } from "../../api/AppBinaryAlias";

export default function AliasPage() {
  const { alias } = useParams();

  const navigate = useNavigate();
  // manual redirect with frontend-constructed url?
  // const queryKey = ['alias', alias];

  useQuery([true], () => {
    if (alias === undefined) throw "alias is empty";
    return getUnwrappedAppBinaryAlias(alias);
  }, {
    onSuccess: (res) => {
      const { alias, appBinaryId } = res;
      navigate(`/i/${appBinaryId}`);
    },
    onError: () => {
      navigate('/')
    }
  });

  return <></>
}