import type { EditorUiMessages } from './types'

export const editorEs: EditorUiMessages = {
  core: {
    placeholder:
      'Escriba contenido o pulse Tab para abrir la barra de bloques',
    loading: 'Cargando editor',
    initError: 'No se pudo inicializar Editor.js.',
    unknownBlocksError:
      'Los datos guardados contienen tipos de bloque no registrados.',
    duplicateAnchorsError: (anchors) =>
      `Los valores de ancla deben ser únicos: ${anchors}.`,
    validationSaveError: 'El contenido del editor tiene errores de validación.',
    saveError: 'No se pudo guardar el contenido del editor.',
  },
  tools: {
    notice: {
      toolboxTitle: 'Aviso',
      titleLabel: 'Título',
      titlePlaceholder: 'Título del aviso',
      textLabel: 'Texto',
      textPlaceholder: 'Texto del aviso',
      typeLabel: 'Tipo',
      typeOptions: {
        info: 'Información',
        success: 'Éxito',
        warning: 'Advertencia',
      },
    },
    sectionIntro: {
      toolboxTitle: 'Introducción',
      titleLabel: 'Título',
      titlePlaceholder: 'Título de la sección',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Escriba un párrafo introductorio',
    },
    twoColumns: {
      toolboxTitle: 'Dos columnas',
      layoutLabel: 'Diseño',
      reverseLabel: 'Invertir al renderizar',
      leftColumnLabel: 'Columna izquierda',
      rightColumnLabel: 'Columna derecha',
      placeholder: 'Añada un párrafo, título o lista',
      layoutOptions: {
        equal: 'Columnas iguales',
        leftWide: 'Izquierda ancha',
        rightWide: 'Derecha ancha',
      },
    },
    mediaGallery: {
      toolboxTitle: 'Galería multimedia',
      modeLabel: 'Modo',
      galleryIdLabel: 'ID de galería',
      galleryIdPlaceholder: 'project-gallery',
      enableViewerLabel: 'Activar visor',
      syncUrlLabel: 'Sincronizar URL',
      addCardButton: 'Añadir tarjeta',
      cardTitle: (index) => `Tarjeta ${index + 1}`,
      moveUpButton: 'Subir',
      moveDownButton: 'Bajar',
      removeButton: 'Eliminar',
      mediaTypeLabel: 'Tipo de medio',
      mediaUrlLabel: 'URL del medio',
      mediaUrlPlaceholder: 'https://example.com/media.jpg',
      altLabel: 'Texto alt',
      altPlaceholder: 'Describa la imagen',
      captionLabel: 'Leyenda',
      captionPlaceholder: 'Leyenda visible corta',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Descripción enriquecida opcional',
      modeOptions: {
        gallery: 'Cuadrícula de galería',
        slider: 'Slider',
      },
      itemTypeOptions: {
        image: 'Imagen',
        video: 'Vídeo',
      },
    },
    maskedFieldsDemo: {
      toolboxTitle: 'Demo de máscaras',
      fields: {
        phone: 'Teléfono',
        date: 'Fecha',
        time: 'Hora',
        price: 'Precio',
        card: 'Tarjeta',
        email: 'Email',
      },
    },
    cta: {
      toolboxTitle: 'Botón CTA',
      labelLabel: 'Texto del botón',
      labelPlaceholder: 'Iniciar un proyecto',
      urlLabel: 'URL',
      urlPlaceholder: 'https://example.com/contact',
      variantLabel: 'Variante',
      targetLabel: 'Destino',
      actionTypeLabel: 'Acción',
      eventNameLabel: 'Nombre del evento',
      eventNamePlaceholder: 'open-demo-modal',
      eventPayloadJsonLabel: 'Payload JSON',
      eventPayloadJsonPlaceholder:
        '{\n  "modalText": "Texto para la ventana modal"\n}',
      variantOptions: {
        primary: 'Principal',
        secondary: 'Secundario',
        ghost: 'Discreto',
      },
      actionTypeOptions: {
        link: 'Abrir enlace',
        event: 'Emitir evento',
      },
      targetOptions: {
        sameTab: 'Misma pestaña',
        newTab: 'Nueva pestaña',
      },
    },
    codeSnippet: {
      toolboxTitle: 'Fragmento de código',
      languageLabel: 'Lenguaje',
      codeLabel: 'Código',
      codePlaceholder: 'Pegue un ejemplo de código',
      captionLabel: 'Leyenda',
      captionPlaceholder: 'Leyenda opcional del código',
      languageOptions: {
        plain: 'Texto plano',
        typescript: 'TypeScript',
        javascript: 'JavaScript',
        vue: 'Vue',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        bash: 'Bash',
      },
    },
    rawHtml: {
      toolboxTitle: 'Raw HTML',
      htmlPlaceholder:
        '<section><h3>Marcado propio</h3><p>HTML confiable.</p></section>',
    },
    embed: {
      toolboxTitle: 'Insertar',
      urlPlaceholder: (services) => `Pegue una URL de ${services}`,
      hint: 'Pulse Enter para crear un bloque embed.',
      supportedServices: (services) => `Servicios compatibles: ${services}.`,
      captionPlaceholder: 'Leyenda',
      editUrlButton: 'Editar URL',
      applyUrlButton: 'Aplicar',
      cancelEditButton: 'Cancelar',
      readError: 'No se pudo leer el archivo de imagen.',
    },
    quote: {
      quotePlaceholder: 'Introduzca una cita',
      captionPlaceholder: 'Leyenda de la cita',
    },
    tableControls: {
      addColumn: 'Añadir columna de tabla',
      addRow: 'Añadir fila de tabla',
      columnMenu: 'Abrir menú de columna de tabla',
      rowMenu: 'Abrir menú de fila de tabla',
    },
    editorToolbar: {
      addBlock: 'Añadir bloque',
      tuneBlock: 'Abrir ajustes del bloque',
    },
  },
  inlineTools: {
    textColor: 'Color de texto',
  },
  tunes: {
    anchor: {
      title: 'Ancla',
      label: 'Ancla',
      placeholder: 'section-anchor',
      duplicateError: 'Esta ancla ya se usa en otro bloque.',
    },
    label: {
      title: 'Etiqueta',
      label: 'Etiqueta',
      placeholder: 'Título del sidebar',
    },
    spacing: {
      title: 'Espaciado',
      topLabel: 'Superior',
      bottomLabel: 'Inferior',
      options: {
        none: 'Ninguno',
        small: 'Pequeño',
        medium: 'Medio',
        large: 'Grande',
      },
    },
    animation: {
      title: 'Animación',
      label: 'Aparición',
      options: {
        none: 'Ninguna',
        'fade-up': 'Aparecer hacia arriba',
        'fade-left': 'Desde la izquierda',
        'fade-right': 'Desde la derecha',
      },
    },
    embedDisplay: {
      title: 'Visualización embed',
      label: 'En Fancybox',
      options: {
        inline: 'En la página',
        fancybox: 'En Fancybox',
      },
    },
  },
  validation: {
    fieldLabels: {
      noticeTitle: 'Título',
      noticeText: 'Texto',
      sectionIntroTitle: 'Título',
      galleryId: 'ID de galería',
      mediaAlt: 'Texto alt',
      mediaCaption: 'Leyenda',
      ctaLabel: 'Texto del botón',
      ctaEventName: 'Nombre del evento',
      ctaEventPayloadJson: 'Payload JSON',
      codeSnippetCode: 'Código',
      codeSnippetCaption: 'Leyenda',
      rawHtml: 'HTML',
    },
    contentValidationFallback: 'El contenido tiene errores de validación.',
    contentValidationSummary: (count) =>
      `El contenido tiene ${count} errores de validación.`,
    noticeContentRequired: 'Añada un título o texto.',
    sectionIntroContentRequired: 'Añada un título o descripción.',
    twoColumnsContentRequired: 'Añada contenido en al menos una columna.',
    mediaCardsRequired: 'Añada al menos una tarjeta multimedia.',
    galleryIdPattern: 'Use solo letras, números, guiones y guiones bajos.',
    mediaUrlRequired: 'La URL del medio es obligatoria.',
    mediaUrlInvalid:
      'Use una URL http, relativa, blob, data image o data video válida.',
    mediaAltRequired: 'El texto alt es obligatorio para imágenes.',
    ctaLabelRequired: 'El texto del botón es obligatorio.',
    ctaUrlRequired: 'La URL es obligatoria.',
    ctaUrlInvalid:
      'Use una URL http, https, mailto, relativa a la raíz o de ancla.',
    ctaEventNameRequired: 'El nombre del evento es obligatorio.',
    ctaEventNameInvalid:
      'Use solo letras, números, guiones, guiones bajos y dos puntos.',
    ctaEventPayloadJsonInvalid: 'Introduzca JSON válido.',
    ctaEventPayloadJsonObjectRequired:
      'El valor raíz del payload debe ser un objeto JSON.',
    codeSnippetCodeRequired: 'El código es obligatorio.',
    rawHtmlRequired: 'El HTML es obligatorio.',
    maxLength: (label, maxLength) =>
      `${label} debe tener ${maxLength} caracteres o menos.`,
  },
  editorJs: {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': 'Haga clic para configurar',
            'or drag to move': 'o arrastre para mover',
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': 'Convertir a',
          },
        },
        toolbar: {
          toolbox: {
            Add: 'Añadir',
          },
        },
      },
      toolNames: {
        Text: 'Texto',
        Heading: 'Título',
        List: 'Lista',
        'Ordered List': 'Lista numerada',
        'Unordered List': 'Lista con viñetas',
        Checklist: 'Checklist',
        Quote: 'Cita',
        Delimiter: 'Separador',
        Table: 'Tabla',
        Image: 'Imagen',
        Embed: 'Insertar',
        'Raw HTML': 'HTML sin procesar',
      },
      tools: {
        warning: {
          Title: 'Título',
          Message: 'Mensaje',
        },
        link: {
          'Add a link': 'Añadir un enlace',
        },
        List: {
          Unordered: 'Viñetas',
          Ordered: 'Numerada',
          Checklist: 'Checklist',
          'Start with': 'Empezar con',
          'Counter type': 'Tipo de contador',
          Numeric: 'Numérico',
          'Lower Roman': 'Romanos minúsculos',
          'Upper Roman': 'Romanos mayúsculos',
          'Lower Alpha': 'Letras minúsculas',
          'Upper Alpha': 'Letras mayúsculas',
        },
        stub: {
          'The block can not be displayed correctly.':
            'El bloque no se puede mostrar correctamente.',
        },
      },
      blockTunes: {
        delete: {
          Delete: 'Eliminar',
          'Click to delete': 'Haga clic para eliminar',
        },
        moveUp: {
          'Move up': 'Mover arriba',
        },
        moveDown: {
          'Move down': 'Mover abajo',
        },
      },
    },
  },
}
