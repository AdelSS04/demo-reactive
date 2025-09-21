/**
 * Represents a basic form validation error with a message
 */
export type FormError = {
  /** Human-readable error message to display to the user */
  message: string;
}

/**
 * Form validation error with an associated key for identification
 */
export type FormErrorWithKey = Prettify<FormError & {
  /** Unique key identifying the type of validation error */
  errorKey: string;
}>

/**
 * Utility type to flatten intersection types for better TypeScript IntelliSense
 * @template T - The type to prettify
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * API error response structure for form validation errors
 */
export type ApiFormError = {
  /** Error message from the API */
  message: string;
  /** Unique error code for programmatic handling */
  code: string;
  /** The form property name that caused the error */
  propertyName: string;
}
