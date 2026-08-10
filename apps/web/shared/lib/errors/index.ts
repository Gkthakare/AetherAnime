/**
 * Error foundation — normalization plus one reporting channel.
 *
 * Consumed as:
 *
 *   import { isAbortError, reportError } from '@/shared/lib/errors';
 */

export { isAbortError, toError } from './normalize';
export { reportError, setErrorReporter } from './report';
export type { ErrorReport, ErrorReporter } from './report';
