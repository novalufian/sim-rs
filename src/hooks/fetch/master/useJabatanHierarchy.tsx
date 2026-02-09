import { useMemo } from 'react'
import { useJabatan, JabatanItem } from '@/hooks/fetch/master/useJabatan'
import { buildJabatanTree, JabatanTreeNode } from '@/utils/jabatanTree'

export const useJabatanHierarchy = () => {
  const { data, isLoading, isError } = useJabatan({ page: 1, limit: 1000 })
  const items: JabatanItem[] = data?.data?.items ?? []

  const treeData: JabatanTreeNode[] = useMemo(() => {
    return buildJabatanTree(items)
  }, [items])

  return {
    treeData,
    isLoading,
    isError,
  }
}
