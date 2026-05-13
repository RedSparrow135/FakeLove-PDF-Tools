'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'es' | 'en'

interface Translations {
  [key: string]: { es: string; en: string }
}

const translations: Translations = {
  // Homepage - Dashboard
  'dashboard.title': { es: 'FAKE LOVE', en: 'FAKE LOVE' },
  'dashboard.subtitle': { es: 'Te fingimos amar tus PDFs', en: 'We pretend to love your PDFs' },
  'dashboard.moto': { es: 'Sin límites. Sin sentimientos. Solo procesamiento.', en: 'No limits. No feelings. Just processing.' },
  'dashboard.selectCategory': { es: 'Selecciona una categoría del menú para comenzar', en: 'Select a category from the sidebar to begin' },
  
  // Tool Titles
  'tool.merge.title': { es: 'FUSIONAR', en: 'MERGE' },
  'tool.split.title': { es: 'DIVIDIR', en: 'SPLIT' },
  'tool.compress.title': { es: 'COMPRIMIR', en: 'COMPRESS' },
  'tool.imagetopdf.title': { es: 'IMAGEN PDF', en: 'IMAGE PDF' },
  'tool.word.title': { es: 'WORD PDF', en: 'WORD PDF' },
  'tool.excel.title': { es: 'EXCEL PDF', en: 'EXCEL PDF' },
  'tool.pptx.title': { es: 'PPTX PDF', en: 'PPTX PDF' },
  'tool.jpg.title': { es: 'JPG PDF', en: 'JPG PDF' },
  
  // Tool Descriptions
  'tool.merge.desc': { es: 'Combina múltiples documentos', en: 'Combine multiple documents' },
  'tool.split.desc': { es: 'Extrae páginas específicas', en: 'Extract specific pages' },
  'tool.compress.desc': { es: 'Reduce el tamaño del archivo', en: 'Reduce file size' },
  'tool.imagetopdf.desc': { es: 'Convierte imágenes a PDF', en: 'Convert images to PDF' },
  'tool.word.desc': { es: 'DOC/DOCX a PDF', en: 'DOC/DOCX to PDF' },
  'tool.excel.desc': { es: 'XLS/XLSX a PDF', en: 'XLS/XLSX to PDF' },
  'tool.pptx.desc': { es: 'PPT/PPTX a PDF', en: 'PPT/PPTX to PDF' },
  'tool.jpg.desc': { es: 'JPG/PNG a PDF', en: 'JPG/PNG to PDF' },
  
  // Navigation
  'nav.dashboard': { es: 'Panel', en: 'Dashboard' },
  'nav.pdfTools': { es: 'Herramientas PDF', en: 'PDF Tools' },
  'nav.convert': { es: 'Convertir', en: 'Convert' },
  'nav.history': { es: 'Historial', en: 'History' },
  'nav.settings': { es: 'Configuración', en: 'Settings' },
  
  // PDF Tools Category
  'pdftools.title': { es: 'HERRAMIENTAS PDF', en: 'PDF TOOLS' },
  'pdftools.subtitle': { es: 'Herramientas profesionales de manipulación de PDFs', en: 'Professional PDF manipulation tools' },
  
  // Convert Category
  'convert.title': { es: 'CONVERTIR A PDF', en: 'CONVERT TO PDF' },
  'convert.subtitle': { es: 'Transforma documentos a formato PDF', en: 'Transform documents into PDF format' },
  
  // History
  'history.title': { es: 'HISTORIAL DE PROCESOS', en: 'PROCESSING HISTORY' },
  'history.subtitle': { es: 'Rastrea todas tus operaciones de archivos', en: 'Track all your file operations' },
  'history.empty': { es: 'Sin operaciones aún', en: 'No operations yet' },
  'history.emptyDesc': { es: 'Comienza a procesar archivos para verlos aquí', en: 'Start processing files to see them here' },
  'history.clear': { es: 'Limpiar completados', en: 'Clear completed' },
  
  // System Status
  'system.processing': { es: 'PROCESANDO', en: 'PROCESSING' },
  'system.activeTasks': { es: 'Tareas activas', en: 'Active Tasks' },
  'system.storage': { es: 'Almacenamiento', en: 'Storage' },
  
  // Operations
  'operation.merge': { es: 'Unir PDF', en: 'Merge PDF' },
  'operation.split': { es: 'Dividir PDF', en: 'Split PDF' },
  'operation.compress': { es: 'Comprimir', en: 'Compress' },
  'operation.imagetopdf': { es: 'Imagen a PDF', en: 'Image to PDF' },
  
  // Status
  'status.completed': { es: 'Completado', en: 'Completed' },
  'status.processing': { es: 'Procesando', en: 'Processing' },
  'status.queued': { es: 'En espera', en: 'Queued' },
  'status.failed': { es: 'Fallido', en: 'Failed' },
  
  // Metrics
  'metrics.totalOperations': { es: 'Total de operaciones', en: 'Total Operations' },
  'metrics.completed': { es: 'Completados', en: 'Completed' },
  'metrics.processing': { es: 'Procesando', en: 'Processing' },
  'metrics.successRate': { es: 'Tasa de éxito', en: 'Success Rate' },
  
  // Settings
  'settings.title': { es: 'CONFIGURACIÓN', en: 'SETTINGS' },
  'settings.subtitle': { es: 'Configura tus preferencias', en: 'Configure your preferences' },
  'settings.language': { es: 'Idioma', en: 'Language' },
  'settings.languageDesc': { es: 'Selecciona tu idioma preferido', en: 'Select your preferred language' },
  'settings.theme': { es: 'Tema', en: 'Theme' },
  'settings.themeDesc': { es: 'Elige el tema de la interfaz', en: 'Choose your interface theme' },
  'settings.quality': { es: 'Calidad por defecto', en: 'Default Quality' },
  'settings.qualityDesc': { es: 'Configura el nivel de compresión por defecto', en: 'Set default compression quality level' },
  
  // Quick Access
  'quickaccess.title': { es: 'ACCESO RÁPIDO', en: 'QUICK ACCESS' },
  
  // Common
  'common.back': { es: '← Volver', en: '← Back' },
  'common.download': { es: 'Descargar', en: 'Download' },
  'common.tryAgain': { es: 'Intentar de nuevo', en: 'Try again' },
  'common.goHome': { es: 'Ir al inicio', en: 'Go home' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'common.confirm': { es: 'Confirmar', en: 'Confirm' },
  'common.error': { es: 'Algo salió mal.', en: 'Something broke.' },
  'common.loading': { es: 'Cargando...', en: 'Loading...' },
  'common.processing': { es: 'Procesando...', en: 'Processing...' },
  'common.files': { es: 'archivos', en: 'files' },
  'common.pages': { es: 'páginas', en: 'pages' },
  
  // File Upload Dialog
  'upload.title': { es: 'SUBIR ARCHIVO', en: 'UPLOAD FILE' },
  'upload.drop': { es: 'Arrastra archivos aquí o haz clic para seleccionar', en: 'Drop files here or click to select' },
  'upload.selected': { es: 'Archivo seleccionado', en: 'File selected' },
  'upload.actions': { es: '¿Qué deseas hacer con este archivo?', en: 'What would you like to do with this file?' },
  
  // Actions
  'action.merge': { es: 'Unir PDFs', en: 'Merge PDFs' },
  'action.split': { es: 'Dividir PDF', en: 'Split PDF' },
  'action.compress': { es: 'Comprimir', en: 'Compress' },
  'action.imagetopdf': { es: 'Imagen a PDF', en: 'Image to PDF' },
  'action.convert': { es: 'Convertir a PDF', en: 'Convert to PDF' },
  'action.preview': { es: 'Vista previa', en: 'Preview' },
  
  // Merge
  'merge.title': { es: 'UNIR PDF', en: 'MERGE PDF' },
  'merge.subtitle': { es: 'Combina múltiples PDFs en uno', en: 'Combine multiple PDFs into one' },
  'merge.humor': { es: 'Es una relación tóxica... pero con archivos', en: 'It\'s a toxic relationship... but with files' },
  'merge.drop': { es: 'Suelta tus PDFs aquí. Fingiremos que esto es difícil.', en: 'Drop your PDFs here. We\'ll pretend this is hard.' },
  'merge.button': { es: 'Unir ahora', en: 'Merge now' },
  'merge.complete': { es: '¡UNIÓN COMPLETA!', en: 'MERGE COMPLETE!' },
  'merge.desc': { es: 'Tus PDFs ahora están juntos. Para bien o para mal.', en: 'Your PDFs are now together. For better or worse.' },
  'merge.error1': { es: 'Necesitas al menos 1 PDF con páginas seleccionadas.', en: 'You need at least 1 PDF with pages selected.' },
  'merge.files': { es: 'Archivos', en: 'Files' },
  'merge.pages': { es: 'Páginas', en: 'Pages' },
  'merge.selected': { es: 'Seleccionadas', en: 'Selected' },
  'merge.panelHint': { es: 'Arrastra para reordenar archivos', en: 'Drag to reorder files' },
  
  // Split
  'split.title': { es: 'DIVIDIR PDF', en: 'SPLIT PDF' },
  'split.subtitle': { es: 'Selecciona las páginas a extraer', en: 'Select pages to extract' },
  'split.humor': { es: 'Elige a tus víctimas', en: 'Choose your victims' },
  'split.drop': { es: 'Suelta tu PDF aquí. Le mostraremos sus feas páginas.', en: 'Drop your PDF here. We\'ll show you its dirty little pages.' },
  'split.selectAll': { es: 'Todo', en: 'All' },
  'split.deselectAll': { es: 'Ninguno', en: 'None' },
  'split.pagesSelected': { es: 'páginas seleccionadas', en: 'pages selected' },
  'split.extract': { es: 'Extraer', en: 'Extract' },
  'split.complete': { es: '¡EXTRACCIÓN COMPLETA!', en: 'EXTRACTION COMPLETE!' },
  'split.desc': { es: 'Extrajimos las páginas de tu PDF.', en: 'We extracted the pages from your PDF.' },
  'split.warning': { es: 'Solo mostrando primeras 100 páginas', en: 'Showing first 100 pages only' },
  'split.error1': { es: 'No hay nada que dividir.', en: 'There\'s nothing to split.' },
  'split.error2': { es: 'Selecciona al menos una página.', en: 'Select at least one page.' },
  'split.panelHint': { es: 'Elige las páginas a extraer', en: 'Choose pages to extract' },
  
  // Compress
  'compress.title': { es: 'COMPRIMIR PDF', en: 'COMPRESS PDF' },
  'compress.subtitle': { es: 'Reduce el tamaño de tu PDF', en: 'Shrink your PDF file size' },
  'compress.humor': { es: 'Sin sentimientos, solo archivos más pequeños', en: 'No feelings, just smaller files' },
  'compress.drop': { es: 'Suelta tu PDF aquí. Le pondremos a dieta.', en: 'Drop your PDF here. We\'ll put it on a diet.' },
  'compress.low': { es: 'Baja', en: 'Low' },
  'compress.lowDesc': { es: 'Calidad: Máxima. Tamaño: Reducción mínima.', en: 'Quality: Maximum. Size: Minimal reduction.' },
  'compress.medium': { es: 'Media', en: 'Medium' },
  'compress.mediumDesc': { es: 'Calidad: Buena. Tamaño: Equilibrado.', en: 'Quality: Good. Size: Balanced.' },
  'compress.high': { es: 'Alta', en: 'High' },
  'compress.highDesc': { es: 'Calidad: Baja. Tamaño: Máxima reducción.', en: 'Quality: Low. Size: Maximum reduction.' },
  'compress.extreme': { es: 'Extrema', en: 'Extreme' },
  'compress.extremeDesc': { es: 'Máxima reducción, pérdida de calidad esperada.', en: 'Maximum reduction, quality loss expected.' },
  'compress.button': { es: 'Comprimir ahora', en: 'Compress now' },
  'compress.complete': { es: '¡COMPRIMIDO!', en: 'COMPRESSED!' },
  'compress.desc': { es: 'Tu PDF ahora es más pequeño. A diferencia de tus problemas.', en: 'Your PDF is now smaller. Unlike your problems.' },
  'compress.error1': { es: 'No hay nada que comprimir.', en: 'There\'s nothing to compress.' },
  'compress.panelHint': { es: 'Elige tu nivel de compresión', en: 'Choose your compression level' },
  'compress.estimated': { es: 'Estimado', en: 'Estimated' },
  'compress.potentialSavings': { es: 'Ahorro potencial', en: 'Potential savings' },
  
  // Image to PDF
  'image.title': { es: 'IMAGEN A PDF', en: 'IMAGE TO PDF' },
  'image.subtitle': { es: 'Convierte imágenes a PDF', en: 'Convert images to PDF' },
  'image.humor': { es: 'Finalmente, una relación que funciona', en: 'Finally, a relationship that works' },
  'image.drop': { es: 'Suelta tus imágenes aquí. Las haremos legítimas.', en: 'Drop your images here. We\'ll make them legitimate.' },
  'image.layout': { es: 'Diseño:', en: 'Layout:' },
  'image.onePerPage': { es: 'Una por página', en: 'One per page' },
  'image.twoPerPage': { es: 'Dos por página', en: 'Two per page' },
  'image.button': { es: 'Convertir ahora', en: 'Convert now' },
  'image.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'image.desc': { es: 'Tus imágenes ahora son un PDF. Finalmente, una relación que funciona.', en: 'Your images are now a PDF. Finally, a relationship that works.' },
  'image.error1': { es: 'No hay nada que convertir.', en: 'There\'s nothing to convert.' },
  'image.multiple': { es: 'Múltiples archivos permitidos', en: 'Multiple files allowed' },
  'image.selected': { es: 'imágenes seleccionadas', en: 'images selected' },
  'image.removeAll': { es: 'Eliminar todo', en: 'Remove All' },
  'image.remove': { es: 'Eliminar', en: 'Remove' },
  'image.images': { es: 'Imágenes', en: 'Images' },
  
  // Word to PDF
  'word.title': { es: 'WORD → PDF', en: 'WORD → PDF' },
  'word.humor': { es: 'Convierte documentos Word a PDF', en: 'Convert Word docs to PDF' },
  'word.drop': { es: 'Suelta tu documento Word aquí', en: 'Drop your Word document here' },
  'word.button': { es: 'Convertir a PDF', en: 'Convert to PDF' },
  'word.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'word.desc': { es: 'Tu documento Word ahora es un PDF.', en: 'Your Word doc is now a PDF!' },
  'word.error1': { es: 'No hay nada que convertir.', en: 'There\'s nothing to convert.' },
  
  // Excel to PDF
  'excel.title': { es: 'EXCEL → PDF', en: 'EXCEL → PDF' },
  'excel.humor': { es: 'Convierte hojas de cálculo a PDF', en: 'Convert spreadsheets to PDF' },
  'excel.drop': { es: 'Suelta tu hoja de cálculo aquí', en: 'Drop your spreadsheet here' },
  'excel.button': { es: 'Convertir a PDF', en: 'Convert to PDF' },
  'excel.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'excel.desc': { es: 'Tu hoja de cálculo ahora es un PDF.', en: 'Your spreadsheet is now a PDF!' },
  
  // PPTX to PDF
  'pptx.title': { es: 'PPTX → PDF', en: 'PPTX → PDF' },
  'pptx.humor': { es: 'Convierte presentaciones a PDF', en: 'Convert presentations to PDF' },
  'pptx.drop': { es: 'Suelta tu presentación aquí', en: 'Drop your presentation here' },
  'pptx.button': { es: 'Convertir a PDF', en: 'Convert to PDF' },
  'pptx.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'pptx.desc': { es: 'Tu presentación ahora es un PDF.', en: 'Your presentation is now a PDF!' },
  'pptx.error1': { es: 'No hay nada que convertir.', en: 'There\'s nothing to convert.' },

  // JPG to PDF
  'jpg.title': { es: 'JPG → PDF', en: 'JPG → PDF' },
  'jpg.humor': { es: 'Convierte imágenes a PDF', en: 'Convert images to PDF' },
  'jpg.drop': { es: 'Suelta tus imágenes aquí', en: 'Drop your images here' },
  'jpg.button': { es: 'Convertir a PDF', en: 'Convert to PDF' },
  'jpg.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'jpg.desc': { es: 'Tus imágenes ahora son un PDF.', en: 'Your images are now a PDF!' },
  'jpg.error1': { es: 'No hay nada que convertir.', en: 'There\'s nothing to convert.' },

  // PDF to DOCX
  'pdf2docx.title': { es: 'PDF → DOCX', en: 'PDF → DOCX' },
  'pdf2docx.humor': { es: 'Convierte PDFs a documentos Word', en: 'Convert PDFs to Word documents' },
  'pdf2docx.drop': { es: 'Suelta tu PDF aquí', en: 'Drop your PDF here' },
  'pdf2docx.button': { es: 'Convertir a DOCX', en: 'Convert to DOCX' },
  'pdf2docx.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'pdf2docx.desc': { es: 'Tu PDF ahora es un documento Word.', en: 'Your PDF is now a Word document!' },
  'pdf2docx.error1': { es: 'Solo se admiten archivos PDF.', en: 'Only PDF files supported.' },

  // PDF to XLSX
  'pdf2xlsx.title': { es: 'PDF → XLSX', en: 'PDF → XLSX' },
  'pdf2xlsx.humor': { es: 'Convierte PDFs a hojas de cálculo', en: 'Convert PDFs to spreadsheets' },
  'pdf2xlsx.drop': { es: 'Suelta tu PDF aquí', en: 'Drop your PDF here' },
  'pdf2xlsx.button': { es: 'Convertir a XLSX', en: 'Convert to XLSX' },
  'pdf2xlsx.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'pdf2xlsx.desc': { es: 'Tu PDF ahora es una hoja de cálculo.', en: 'Your PDF is now a spreadsheet!' },
  'pdf2xlsx.error1': { es: 'Solo se admiten archivos PDF.', en: 'Only PDF files supported.' },

  // PDF to PPTX
  'pdf2pptx.title': { es: 'PDF → PPTX', en: 'PDF → PPTX' },
  'pdf2pptx.humor': { es: 'Convierte PDFs a presentaciones', en: 'Convert PDFs to presentations' },
  'pdf2pptx.drop': { es: 'Suelta tu PDF aquí', en: 'Drop your PDF here' },
  'pdf2pptx.button': { es: 'Convertir a PPTX', en: 'Convert to PPTX' },
  'pdf2pptx.complete': { es: '¡CONVERTIDO!', en: 'CONVERTED!' },
  'pdf2pptx.desc': { es: 'Tu PDF ahora es una presentación.', en: 'Your PDF is now a presentation!' },
  'pdf2pptx.error1': { es: 'Solo se admiten archivos PDF.', en: 'Only PDF files supported.' },
  
  // Loader
  'loader.processing': { es: 'Procesando...', en: 'Processing...' },

  // DropZone & Common UI
  'dropzone.hint': { es: 'Solo PDF • Máximo 50MB', en: 'PDF only • Max 50MB' },
  'dropzone.hintImage': { es: 'Imágenes • Máximo 50MB', en: 'Images • Max 50MB' },
  'dropzone.hintDoc': { es: 'Solo documentos', en: 'Documents only' },
  
  // Buttons
  'button.process': { es: 'Procesar', en: 'Process' },
  'button.convert': { es: 'Convertir', en: 'Convert' },
  'button.extract': { es: 'Extraer', en: 'Extract' },
  'button.compress': { es: 'Comprimir', en: 'Compress' },
  'button.merge': { es: 'Fusionar', en: 'Merge' },
  
  // Notifications
  'notifications.title': { es: 'Notificaciones', en: 'Notifications' },
  'notifications.noActive': { es: 'No hay tareas activas', en: 'No active tasks' },
  
  // File actions
  'file.remove': { es: 'Eliminar', en: 'Remove' },
  'file.preview': { es: 'Ver', en: 'Preview' },
  'file.download': { es: 'Descargar', en: 'Download' },
  'file.reorder': { es: 'Reordenar', en: 'Reorder' },

  // Navbar & UI
  'navbar.search': { es: 'Buscar archivos u operaciones...', en: 'Search files or operations...' },
  'navbar.systemOnline': { es: 'Sistema en línea', en: 'System Online' },
  'navbar.activeTasks': { es: 'tareas activas', en: 'active tasks' },

  // Intro Banner
  'intro.title': { es: 'FakeLove PDF Tools', en: 'FakeLove PDF Tools' },
  'intro.desc': { es: 'Manipulación profesional de PDFs con un toque sarcástico. Sin límites, sin juicios, solo resultados.', en: 'Professional PDF manipulation with a sarcastic twist. No limits, no judgments, just results.' },
  'intro.tag.merge': { es: 'Fusionar PDF', en: 'PDF Merge' },
  'intro.tag.split': { es: 'Dividir PDF', en: 'PDF Split' },
  'intro.tag.image': { es: 'Imagen → PDF', en: 'Image → PDF' },
  'intro.tag.word': { es: 'Word → PDF', en: 'Word → PDF' },
  'intro.github': { es: 'Ver en GitHub', en: 'View on GitHub' },

  // History Table
  'table.file': { es: 'ARCHIVO', en: 'FILE' },
  'table.operation': { es: 'OPERACIÓN', en: 'OPERATION' },
  'table.status': { es: 'ESTADO', en: 'STATUS' },
  'table.time': { es: 'TIEMPO', en: 'TIME' },
  'table.size': { es: 'TAMAÑO', en: 'SIZE' },
  'table.actions': { es: 'ACCIONES', en: 'ACTIONS' },
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  isSpanish: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'fake_love_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('es')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'es') {
        setLangState(saved)
      }
    } catch (e) {
      console.error('Failed to load language:', e)
    }
    setIsLoaded(true)
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch (e) {
      console.error('Failed to save language:', e)
    }
  }

  const t = (key: string): string => {
    return translations[key]?.[lang] || key
  }

  if (!isLoaded) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isSpanish: lang === 'es' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}