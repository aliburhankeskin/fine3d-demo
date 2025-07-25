/**
 * Language model.
 */
export interface ILanguageDto {
  /** Language id. */
  id: number;
  /** Name of the language. */
  name: string;
  /** Iso code of the language. */
  code: string;
  /** Determines whether the language is supported or not. */
  supported: boolean;
  /** Determines whether language is supported or not. */
  supportedDescription: string;
  /** Determines whether the language is default or not. */
  isDefault: boolean;
  /** Determines whether language is default or not. */
  isDefaultDescription: string;
}
