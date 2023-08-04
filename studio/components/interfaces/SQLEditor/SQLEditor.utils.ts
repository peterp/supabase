// @ts-ignore
import MarkdownTable from 'markdown-table'
import { NEW_SQL_SNIPPET_SKELETON } from './SQLEditor.constants'
import { SqlSnippets, UserContent } from 'types'
import { DiffType } from './SQLEditor.types'

export const getResultsMarkdown = (results: any[]) => {
  const columns = Object.keys(results[0])
  const rows = results.map((x: any) => {
    const temp: any[] = []
    columns.forEach((col) => temp.push(x[col]))
    return temp
  })
  const table = [columns].concat(rows)
  return MarkdownTable(table)
}

export const createSqlSnippetSkeleton = ({
  name,
  sql,
  owner_id,
}: {
  name?: string
  sql?: string
  owner_id?: number
} = {}): UserContent<SqlSnippets.Content> => {
  return {
    ...NEW_SQL_SNIPPET_SKELETON,
    ...(name && { name }),
    ...(owner_id && { owner_id }),
    content: {
      ...NEW_SQL_SNIPPET_SKELETON.content,
      content_id: '',
      sql: sql ?? '',
    },
  }
}

export function getDiffTypeButtonLabel(diffType: DiffType) {
  switch (diffType) {
    case DiffType.Modification:
      return 'Accept change'
    case DiffType.Addition:
      return 'Accept addition'
    case DiffType.NewSnippet:
      return 'Create new snippet'
    default:
      throw new Error(`Unknown diff type '${diffType}'`)
  }
}

export function getDiffTypeDropdownLabel(diffType: DiffType) {
  switch (diffType) {
    case DiffType.Modification:
      return 'Compare as change'
    case DiffType.Addition:
      return 'Compare as addition'
    case DiffType.NewSnippet:
      return 'Compare as new snippet'
    default:
      throw new Error(`Unknown diff type '${diffType}'`)
  }
}
