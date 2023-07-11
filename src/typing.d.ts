// https://github.com/mwilliamson/mammoth.js/issues/193#issuecomment-757128398
declare module 'mammoth' {
  interface Input {
    /** The path to the .docx file. */
    path?: string

    /** The buffer containing the .docx file, if path is not specified. */
    buffer?: Buffer

    arrayBuffer?: ArrayBuffer
  }

  /** Conversion options. */
  interface Options {
    /**
     *  Overrides for the default style map.
     *  Examples:
     *      "b => em"
     *      "i => strong"
     */
    styleMap?: string[]

    /** To stop using the default style map. */
    includeDefaultStyleMap?: boolean

    convertImage?: unknown
  }

  /** The error or warning message returned from the processing operation. */
  interface Message {
    /** a string representing the type of the message, such as "warning" or "error" */
    type: 'warning' | 'error'

    /** a string containing the actual message */
    message: string

    /** the thrown exception that caused this message, if any */
    error?: Error
  }

  /** The result from the processing operation. */
  interface Result {
    /** The HTML result. */
    value: string

    /** Error and warning messages if any. */
    messages: Message[]
  }

  namespace images {
    interface Image {
      read: (type: string) => Promise<Buffer>
      contentType: string
    }

    interface Source {
      src: string
    }

    export function imgElement(callback: (image: Image) => Source | Promise<Source>): void
  }

  /**
   * Converts an existing .docx file to HTML.
   * @param input An object containing the path or buffer.
   */
  export function convertToHtml(input: Input, options?: Options): Promise<Result>
  export function convertToMarkdown(input: Input, options?: Options): Promise<Result>

  /**
   * Converts an existing .docx file to plain texts.
   * @param input An object containing the path or buffer.
   */
  export function extractRawText(input: Input): Promise<Result>
}
