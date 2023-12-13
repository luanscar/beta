import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import queryString from "query-string";
import toast from "react-hot-toast";

interface useCreateUserProps {
  queryKey: string;
  apiUrl: string;
  values: any;
  paramKey: "companyId" | "userId";
  paramValue: string;
}

export const useCreateUser = ({
  queryKey,
  apiUrl,
  values,
  paramKey,
  paramValue,
}: useCreateUserProps) => {
  const queryClient = useQueryClient();

  const createNewUser = async () => {
    const url = queryString.stringifyUrl({
      url: apiUrl,
      query: {
        [paramKey]: paramValue,
      },
    });

    await axios.post(url, values).then((res) => {
      if (res.statusText === "Created") {
        toast.success("Usuário criado!");
      }
    });
  };

  const {
    isPending: isLoadingCreate,
    error: errorCreate,
    mutate: requestCreate,
  } = useMutation({
    mutationFn: createNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
    },
  });

  return { isLoadingCreate, errorCreate, requestCreate };
};
