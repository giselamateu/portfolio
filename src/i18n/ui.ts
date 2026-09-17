export const languages = { es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    'site.name': 'Gisela Mateu',
    'site.role': 'Diseñadora de moda',
    'site.location': 'Barcelona, España',
    'nav.work': 'Proyectos',
    'nav.about': 'Perfil',
    'nav.contact': 'Contacto',
    'nav.instagram': 'Instagram',
    'nav.skip': 'Saltar al contenido',

    'home.tagline':
      'Graduada en diseño de moda, con una mirada creativa, conceptual y contemporánea',
    'home.heroCta': 'Ver el perfil',
    'home.projects': 'Proyectos',
    'home.moreSoon': 'Nuevos proyectos en camino.',

    'project.concept': 'Concepto',
    'project.moodboard': 'Moodboard',
    'project.palette': 'Paleta',
    'project.lineup': 'Line up',
    'project.editorial': 'Editorial',
    'project.process': 'Proceso',
    'project.fichas': 'Fichas técnicas',
    'project.credits': 'Créditos',
    'project.meta': 'Ficha del proyecto',
    'project.season': 'Temporada',
    'project.year': 'Año',
    'project.role': 'Ámbito',
    'project.lineupCaption': 'Propuestas de la colección, vistas frontal y posterior.',
    'project.clo': '3D · CLO',
    'project.cloCaption': 'Modelado y simulación 3D de los looks en CLO.',
    'project.moulageCaption': 'Moulage y patronaje sobre maniquí.',
    'project.processCaption': 'Páginas del sketchbook de investigación: referencias, tejidos y montaje del concepto.',
    'project.fichasCaption': 'Documentación técnica de cada prenda: tejidos, fornituras y patronaje.',
    'project.back': 'Volver a proyectos',

    'gallery.open': 'Ampliar imagen',
    'gallery.close': 'Cerrar',
    'gallery.prev': 'Anterior',
    'gallery.next': 'Siguiente',
    'gallery.counter': 'de',

    'about.title': 'Perfil',
    'about.lead':
      'Soy diseñadora de moda formada en ESDi, Universitat Ramon Llull. Mi trabajo parte de la investigación, la observación y la experimentación, transformando referencias, materiales y tendencias en propuestas contemporáneas.',
    'about.body1':
      'Me interesa especialmente explorar siluetas, volúmenes y detalles constructivos, combinando creatividad, funcionalidad y una mirada estética propia.',
    'about.body2':
      'Soy una persona curiosa, observadora y adaptable, con ganas de seguir creciendo dentro de la industria de la moda y aportar mi sensibilidad y visión al desarrollo de producto.',
    'about.contact': 'Contacto',
    'about.emailLabel': 'Correo',
    'about.instagramLabel': 'Instagram',
    'about.availability': 'Disponible para proyectos, colaboraciones y encargos.',
    'about.write': 'Escríbeme',

    'contact.title': 'Contacto',
    'contact.lead': 'Cuéntame tu proyecto, encargo o colaboración. Te responderé lo antes posible.',
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar mensaje',
    'contact.sending': 'Enviando…',
    'contact.success': 'Gracias. Mensaje enviado.',
    'contact.error': 'No se pudo enviar el mensaje.',
    'contact.direct': 'También puedes escribirme directamente a',
    'contact.required': 'obligatorio',

    'instagram.title': 'Instagram',
    'instagram.lead': 'Trabajo en curso, proceso y publicaciones.',
    'instagram.follow': 'Seguir en Instagram',
    'instagram.empty': 'Sígueme en Instagram para ver el día a día.',

    'footer.rights': 'Todos los derechos reservados',
    'footer.imageRights': 'Imágenes y diseño de la colección',
    'lang.switch': 'Ver en inglés',
    'lang.current': 'Idioma',
  },
  en: {
    'site.name': 'Gisela Mateu',
    'site.role': 'Fashion designer',
    'site.location': 'Barcelona, Spain',
    'nav.work': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.instagram': 'Instagram',
    'nav.skip': 'Skip to content',

    'home.tagline':
      'Fashion design graduate, with a creative, conceptual and contemporary outlook',
    'home.heroCta': 'Read the profile',
    'home.projects': 'Projects',
    'home.moreSoon': 'More projects on the way.',

    'project.concept': 'Concept',
    'project.moodboard': 'Moodboard',
    'project.palette': 'Palette',
    'project.lineup': 'Line up',
    'project.editorial': 'Editorial',
    'project.process': 'Process',
    'project.fichas': 'Technical sheets',
    'project.credits': 'Credits',
    'project.meta': 'Project details',
    'project.season': 'Season',
    'project.year': 'Year',
    'project.role': 'Field',
    'project.lineupCaption': 'Collection proposals, front and back views.',
    'project.clo': '3D · CLO',
    'project.cloCaption': '3D modelling and simulation of the looks in CLO.',
    'project.moulageCaption': 'Draping and pattern-making on the dress form.',
    'project.processCaption': 'Sketchbook pages: references, fabrics and concept assembly.',
    'project.fichasCaption': 'Technical documentation for each piece: fabrics, hardware and pattern cutting.',
    'project.back': 'Back to projects',

    'gallery.open': 'Enlarge image',
    'gallery.close': 'Close',
    'gallery.prev': 'Previous',
    'gallery.next': 'Next',
    'gallery.counter': 'of',

    'about.title': 'About',
    'about.lead':
      'I am a fashion designer trained at ESDi, Universitat Ramon Llull. My work starts from research, observation and experimentation, transforming references, materials and trends into contemporary proposals.',
    'about.body1':
      'I am especially interested in exploring silhouettes, volumes and constructive details, combining creativity, functionality and my own aesthetic eye.',
    'about.body2':
      'I am curious, observant and adaptable, eager to keep growing within the fashion industry and to bring my sensitivity and vision to product development.',
    'about.contact': 'Contact',
    'about.emailLabel': 'Email',
    'about.instagramLabel': 'Instagram',
    'about.availability': 'Available for projects, collaborations and commissions.',
    'about.write': 'Write to me',

    'contact.title': 'Contact',
    'contact.lead': 'Tell me about your project, commission or collaboration. I will reply as soon as I can.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending…',
    'contact.success': 'Thank you. Message sent.',
    'contact.error': 'The message could not be sent.',
    'contact.direct': 'You can also write to me directly at',
    'contact.required': 'required',

    'instagram.title': 'Instagram',
    'instagram.lead': 'Work in progress, process and posts.',
    'instagram.follow': 'Follow on Instagram',
    'instagram.empty': 'Follow me on Instagram to see the day to day.',

    'footer.rights': 'All rights reserved',
    'footer.imageRights': 'Collection imagery and design',
    'lang.switch': 'View in Spanish',
    'lang.current': 'Language',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];
