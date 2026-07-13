import { useQuery } from '@tanstack/react-query'
import { search } from '@/features/search/api/search-api'

export function useSearch(query: string, types?: string[]) {
  return useQuery({
    queryKey: ['search', query, types],
    queryFn: () => search(query, types),
    enabled: query.trim().length >= 2,
  })
}
