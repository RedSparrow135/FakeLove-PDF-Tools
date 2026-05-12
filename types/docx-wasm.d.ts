declare module '@nativedocuments/docx-wasm' {
  interface DocXEngine {
    load(document: Uint8Array | string): Promise<void>
    exportPDF(): Promise<Uint8Array>
    exportDOCX(): Promise<Uint8Array>
    close(): Promise<void>
  }

  interface InitOptions {
    ENVIRONMENT: 'NODE' | 'BROWSER'
    ND_DEV_ID?: string
    ND_DEV_SECRET?: string
    LAZY_INIT?: boolean
  }

  const docx: {
    init(options: InitOptions): Promise<void>
    engine(): Promise<DocXEngine>
  }

  export default docx
}
