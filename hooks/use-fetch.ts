import fetcher from '@/lib/fetcher';
import useSWR from 'swr';


const usePost = (companyId: string) => {
  const { data, error, isLoading, mutate } = useSWR(companyId ? `/api/posts/${companyId}` : null, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default usePost;