import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";
interface useMutateProps {
  
}
const useMutate = ({

}: useMutateProps) => {

  const queryClient = useQueryClient();

  const {mutate: onSubmit} = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries(["ListUsers"]);
    },
  });





  return { onSubmit };
};

export default useMutate;
