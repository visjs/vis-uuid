import { parseUUID, stringifyUUID } from './parsing'
import { uuid1 } from './uuid1'
import { uuid4 } from './uuid4'

// Export new API
export * from './parsing'
export * from './uuid1'
export * from './uuid4'

// Export backwards compatible API
// Rollup will complain about mixing default and named exports in UMD build,
// but since they both implement the same interface, there won't be any problems.

/**
 * API properties as used before ES2015 modules and TypeScript.
 */
export interface OldAPIProps {
  /** Generate UUIDv1. */
  v1: typeof uuid1
  /** Generate UUIDv4. */
  v4: typeof uuid4
  /** Parse string UUID representation into bytes. */
  parse: typeof parseUUID
  /** Parse bytes into string UUID representation. */
  unparse: typeof stringifyUUID
}

/**
 * API as used before ES2015 modules and TypeScript.
 */
export type OldAPI = typeof uuid4 & OldAPIProps

const oldAPI: OldAPI = ((...args: Parameters<typeof uuid4>): ReturnType<typeof uuid4> => {
  return uuid4(...args)
}) as OldAPI

oldAPI.v1 = uuid1
oldAPI.v4 = uuid4
oldAPI.parse = parseUUID
oldAPI.unparse = stringifyUUID

export default oldAPI
export { uuid1 as v1, uuid4 as v4, parseUUID as parse, stringifyUUID as unparse }
