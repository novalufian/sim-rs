export interface JabatanNodeInput {
  id: string
  nama_jabatan: string
  tipe_jabatan?: string | null
  tingkat_jabatan?: string | null
  parent_id?: string | null
}

export interface JabatanTreeNode {
  name: string
  attributes: {
    tipe?: string | null
    eselon?: string | null
  }
  children: JabatanTreeNode[]
}

export const buildJabatanTree = (data: JabatanNodeInput[]): JabatanTreeNode[] => {
  const byParent = new Map<string | null, JabatanNodeInput[]>()

  data.forEach((item) => {
    const parentKey = item.parent_id ?? null
    if (!byParent.has(parentKey)) {
      byParent.set(parentKey, [])
    }
    byParent.get(parentKey)!.push(item)
  })

  const buildNodes = (parentId: string | null): JabatanTreeNode[] => {
    const items = byParent.get(parentId) ?? []
    return items.map((item) => ({
      name: item.nama_jabatan,
      attributes: {
        tipe: item.tipe_jabatan ?? null,
        eselon: item.tingkat_jabatan ?? null,
      },
      children: buildNodes(item.id),
    }))
  }

  return buildNodes(null)
}
