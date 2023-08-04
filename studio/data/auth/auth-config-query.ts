import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { components } from 'data/api'
import { get, isResponseOk } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { authKeys } from './keys'

export type AuthConfigVariables = {
  projectRef?: string
}

export type AuthConfigResponse = components['schemas']['GetGoTrueConfigResponse']

export async function getProjectAuthConfig(
  { projectRef }: AuthConfigVariables,
  signal?: AbortSignal
) {
  if (!projectRef) {
    throw new Error('projectRef is required')
  }

  const response = await get<AuthConfigResponse>(`${API_URL}/auth/${projectRef}/config`, {
    signal,
  })
  if (!isResponseOk(response)) {
    throw response.error
  }

  return response
}

export type ResourceData = Awaited<ReturnType<typeof getProjectAuthConfig>>
export type ResourceError = unknown

export const useAuthConfigQuery = <TData = ResourceData>(
  { projectRef }: AuthConfigVariables,
  { enabled = true, ...options }: UseQueryOptions<ResourceData, ResourceError, TData> = {}
) =>
  useQuery<ResourceData, ResourceError, TData>(
    authKeys.authConfig(projectRef),
    ({ signal }) => getProjectAuthConfig({ projectRef }, signal),
    {
      enabled: enabled && typeof projectRef !== 'undefined',
      ...options,
    }
  )

export const useAuthConfigPrefetch = ({ projectRef }: AuthConfigVariables) => {
  const client = useQueryClient()

  return useCallback(() => {
    if (projectRef) {
      client.prefetchQuery(authKeys.authConfig(projectRef), ({ signal }) =>
        getProjectAuthConfig({ projectRef }, signal)
      )
    }
  }, [client, projectRef])
}
