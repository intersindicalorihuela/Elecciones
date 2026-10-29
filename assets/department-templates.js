/**
 * Sistema de Gestión de Plantillas de Departamento Editables
 * Para el simulador de elecciones sindicales de la Conselleria de Sanidad Valenciana
 * 
 * Este módulo permite:
 * - Cargar plantillas de departamento predefinidas
 * - Editar plantillas existentes
 * - Crear nuevas plantillas (hasta 24 departamentos)
 * - Guardar plantillas en localStorage para persistencia
 */

const DEPARTMENT_TEMPLATES_STORAGE_KEY = 'intersindical_department_templates_v2';
const MAX_DEPARTMENTS = 24;

/**
 * Plantillas predefinidas de departamentos
 * Estas son las plantillas originales del sistema
 */
const DEFAULT_TEMPLATES = {
  orihuela_3: {
    id: 'orihuela_3',
    name: 'Dpto. Orihuela (3 Mesas · 23 Puestos)',
    description: 'H. Vega Baja, C.S. Orihuela, C.S. Callosa/Almoradí',
    config: {
      census: 0,
      title: 'Elecciones a Junta de Personal · Departamento de Salud de Orihuela',
      organType: 'Junta de Personal',
      workCenter: 'Hospital Vega Baja y Centros de Salud',
      department: 'Departamento de Salud de Orihuela (Sanitat GVA)',
      location: 'Orihuela (Alicante)',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 23,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: 'Escrutinio provisional en 3 mesas electorales conforme al Art. 71.2 ET.'
    },
    mesas: [
      {
        id: 'm1',
        number: 1,
        name: 'Mesa 1 - Hospital Vega Baja (Especializada)',
        census: 920,
        blankVotes: 8,
        nullVotes: 3,
        votesByCandidacy: {
          'cand-iv': 220,
          'cand-ccoo': 175,
          'cand-satse': 165,
          'cand-csif': 120,
          'cand-ugt': 90,
          'cand-usae': 70,
          'cand-simap': 55,
          'cand-indep': 22
        }
      },
      {
        id: 'm2',
        number: 2,
        name: 'Mesa 2 - C.S. Orihuela y Primaria Sur',
        census: 480,
        blankVotes: 4,
        nullVotes: 2,
        votesByCandidacy: {
          'cand-iv': 115,
          'cand-ccoo': 95,
          'cand-satse': 80,
          'cand-csif': 68,
          'cand-ugt': 52,
          'cand-usae': 30,
          'cand-simap': 24,
          'cand-indep': 14
        }
      },
      {
        id: 'm3',
        number: 3,
        name: 'Mesa 3 - C.S. Callosa de Segura y Almoradí',
        census: 420,
        blankVotes: 2,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 90,
          'cand-ccoo': 80,
          'cand-satse': 65,
          'cand-csif': 57,
          'cand-ugt': 43,
          'cand-usae': 20,
          'cand-simap': 16,
          'cand-indep': 9
        }
      }
    ]
  },
  torrevieja_3: {
    id: 'torrevieja_3',
    name: 'Dpto. Torrevieja (3 Mesas · 21 Puestos)',
    description: 'H. Universitario Torrevieja y Atención Primaria',
    config: {
      census: 0,
      title: 'Elecciones a Junta de Personal · Departamento de Salud de Torrevieja',
      organType: 'Junta de Personal',
      workCenter: 'Hospital Universitario de Torrevieja',
      department: 'Departamento de Salud de Torrevieja (Sanitat GVA)',
      location: 'Torrevieja (Alicante)',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 21,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: 'Escrutinio provisional en 3 mesas electorales.'
    },
    mesas: [
      {
        id: 'm-torre-1',
        number: 1,
        name: 'Mesa 1 - Hospital Universitario de Torrevieja',
        census: 540,
        blankVotes: 6,
        nullVotes: 2,
        votesByCandidacy: {
          'cand-iv': 140,
          'cand-ccoo': 110,
          'cand-satse': 95,
          'cand-csif': 75,
          'cand-ugt': 50,
          'cand-usae': 35,
          'cand-simap': 25,
          'cand-indep': 10
        }
      },
      {
        id: 'm-torre-2',
        number: 2,
        name: 'Mesa 2 - C.S. La Loma y C.S. Acequión',
        census: 240,
        blankVotes: 3,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 65,
          'cand-ccoo': 50,
          'cand-satse': 42,
          'cand-csif': 35,
          'cand-ugt': 20,
          'cand-usae': 15,
          'cand-simap': 12,
          'cand-indep': 5
        }
      },
      {
        id: 'm-torre-3',
        number: 3,
        name: 'Mesa 3 - C.S. Rojales, Guardamar y Pilar de la Horadada',
        census: 210,
        blankVotes: 2,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 55,
          'cand-ccoo': 45,
          'cand-satse': 38,
          'cand-csif': 30,
          'cand-ugt': 18,
          'cand-usae': 12,
          'cand-simap': 10,
          'cand-indep': 4
        }
      }
    ]
  },
  elche_4: {
    id: 'elche_4',
    name: 'Dpto. Elche General (4 Mesas · 23 Puestos)',
    description: 'H. General, Elche Centro, Santa Pola y Crevillent',
    config: {
      census: 0,
      title: 'Elecciones a Junta de Personal · Departamento Elche General',
      organType: 'Junta de Personal',
      workCenter: 'Hospital General Universitario de Elche',
      department: 'Departamento de Salud Elche - General (Sanitat GVA)',
      location: 'Elche (Alicante)',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 23,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: ''
    },
    mesas: [
      {
        id: 'm-elche-1',
        number: 1,
        name: 'Mesa 1 - Hospital General Universitario',
        census: 850,
        blankVotes: 8,
        nullVotes: 3,
        votesByCandidacy: {
          'cand-iv': 210,
          'cand-ccoo': 165,
          'cand-satse': 150,
          'cand-csif': 115,
          'cand-ugt': 85,
          'cand-usae': 60,
          'cand-simap': 45,
          'cand-indep': 18
        }
      },
      {
        id: 'm-elche-2',
        number: 2,
        name: 'Mesa 2 - C.S. Elche Centro y Raval',
        census: 380,
        blankVotes: 4,
        nullVotes: 2,
        votesByCandidacy: {
          'cand-iv': 95,
          'cand-ccoo': 75,
          'cand-satse': 68,
          'cand-csif': 52,
          'cand-ugt': 38,
          'cand-usae': 25,
          'cand-simap': 18,
          'cand-indep': 8
        }
      },
      {
        id: 'm-elche-3',
        number: 3,
        name: 'Mesa 3 - C.S. Santa Pola',
        census: 290,
        blankVotes: 3,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 72,
          'cand-ccoo': 58,
          'cand-satse': 50,
          'cand-csif': 40,
          'cand-ugt': 30,
          'cand-usae': 20,
          'cand-simap': 14,
          'cand-indep': 6
        }
      },
      {
        id: 'm-elche-4',
        number: 4,
        name: 'Mesa 4 - C.S. Crevillent',
        census: 260,
        blankVotes: 2,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 65,
          'cand-ccoo': 52,
          'cand-satse': 45,
          'cand-csif': 35,
          'cand-ugt': 25,
          'cand-usae': 18,
          'cand-simap': 12,
          'cand-indep': 5
        }
      }
    ]
  },
  alcoi_2: {
    id: 'alcoi_2',
    name: 'Dpto. Alcoi (2 Mesas · 17 Puestos)',
    description: 'Hospital Virgen de los Lirios y Centros de Salud',
    config: {
      census: 0,
      title: 'Elecciones a Junta de Personal · Departamento de Salud de Alcoi',
      organType: 'Junta de Personal',
      workCenter: 'Hospital Virgen de los Lirios de Alcoi',
      department: 'Departamento de Salud de Alcoi (Sanitat GVA)',
      location: 'Alcoi (Alicante)',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 17,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: ''
    },
    mesas: [
      {
        id: 'm-alcoi-1',
        number: 1,
        name: 'Mesa 1 - Hospital Virgen de los Lirios',
        census: 450,
        blankVotes: 5,
        nullVotes: 2,
        votesByCandidacy: {
          'cand-iv': 120,
          'cand-ccoo': 85,
          'cand-satse': 78,
          'cand-csif': 55,
          'cand-ugt': 40,
          'cand-usae': 25,
          'cand-simap': 20,
          'cand-indep': 8
        }
      },
      {
        id: 'm-alcoi-2',
        number: 2,
        name: 'Mesa 2 - Centros de Salud Comarcales',
        census: 270,
        blankVotes: 3,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 70,
          'cand-ccoo': 50,
          'cand-satse': 45,
          'cand-csif': 35,
          'cand-ugt': 25,
          'cand-usae': 16,
          'cand-simap': 12,
          'cand-indep': 5
        }
      }
    ]
  },
  alicante_5: {
    id: 'alicante_5',
    name: 'Dpto. Sant Joan d\'Alacant (5 Mesas · 23 Puestos)',
    description: 'Hospital Universitario y Zonas Básicas de Salud',
    config: {
      census: 0,
      title: 'Elecciones a Junta de Personal · Dpto. Sant Joan d\'Alacant',
      organType: 'Junta de Personal',
      workCenter: 'Hospital Universitario San Juan de Alicante',
      department: 'Departamento de Salud Alacant - Sant Joan (Sanitat GVA)',
      location: 'Sant Joan / Alacant',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 23,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: ''
    },
    mesas: [
      {
        id: 'm-sj-1',
        number: 1,
        name: 'Mesa 1 - Hospital Universitario Sant Joan',
        census: 750,
        blankVotes: 7,
        nullVotes: 3,
        votesByCandidacy: {
          'cand-iv': 180,
          'cand-ccoo': 140,
          'cand-satse': 130,
          'cand-csif': 95,
          'cand-ugt': 75,
          'cand-usae': 50,
          'cand-simap': 40,
          'cand-indep': 15
        }
      },
      {
        id: 'm-sj-2',
        number: 2,
        name: 'Mesa 2 - C.S. San Juan y Muchamiel',
        census: 320,
        blankVotes: 3,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 80,
          'cand-ccoo': 60,
          'cand-satse': 55,
          'cand-csif': 42,
          'cand-ugt': 32,
          'cand-usae': 22,
          'cand-simap': 18,
          'cand-indep': 7
        }
      },
      {
        id: 'm-sj-3',
        number: 3,
        name: 'Mesa 3 - C.S. San Vicente I y II',
        census: 350,
        blankVotes: 3,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 85,
          'cand-ccoo': 65,
          'cand-satse': 60,
          'cand-csif': 45,
          'cand-ugt': 35,
          'cand-usae': 24,
          'cand-simap': 20,
          'cand-indep': 8
        }
      },
      {
        id: 'm-sj-4',
        number: 4,
        name: 'Mesa 4 - C.S. El Campello',
        census: 240,
        blankVotes: 2,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 60,
          'cand-ccoo': 45,
          'cand-satse': 40,
          'cand-csif': 32,
          'cand-ugt': 24,
          'cand-usae': 16,
          'cand-simap': 14,
          'cand-indep': 5
        }
      },
      {
        id: 'm-sj-5',
        number: 5,
        name: 'Mesa 5 - C.S. Jijona y Montaña',
        census: 180,
        blankVotes: 2,
        nullVotes: 1,
        votesByCandidacy: {
          'cand-iv': 45,
          'cand-ccoo': 35,
          'cand-satse': 30,
          'cand-csif': 24,
          'cand-ugt': 18,
          'cand-usae': 12,
          'cand-simap': 10,
          'cand-indep': 4
        }
      }
    ]
  }
};

/**
 * Obtener todas las plantillas (incluyendo las guardadas por el usuario)
 */
function getAllTemplates() {
  try {
    const savedTemplates = localStorage.getItem(DEPARTMENT_TEMPLATES_STORAGE_KEY);
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
  } catch (e) {
    console.error('Error al cargar plantillas guardadas:', e);
  }
  return { ...DEFAULT_TEMPLATES };
}

/**
 * Guardar todas las plantillas en localStorage
 */
function saveAllTemplates(templates) {
  try {
    localStorage.setItem(DEPARTMENT_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (e) {
    console.error('Error al guardar plantillas:', e);
    return false;
  }
}

/**
 * Obtener una plantilla por su ID
 */
function getTemplateById(templateId) {
  const allTemplates = getAllTemplates();
  return allTemplates[templateId];
}

/**
 * Guardar/actualizar una plantilla
 */
function saveTemplate(template) {
  const allTemplates = getAllTemplates();
  
  // Validar que no excedemos el máximo de departamentos
  const templateCount = Object.keys(allTemplates).length;
  if (!allTemplates[template.id] && templateCount >= MAX_DEPARTMENTS) {
    throw new Error(`No se pueden crear más de ${MAX_DEPARTMENTS} plantillas de departamento`);
  }
  
  allTemplates[template.id] = template;
  return saveAllTemplates(allTemplates);
}

/**
 * Eliminar una plantilla (ahora permite eliminar cualquier plantilla)
 */
function deleteTemplate(templateId) {
  const allTemplates = getAllTemplates();
  delete allTemplates[templateId];
  return saveAllTemplates(allTemplates);
}

/**
 * Crear una nueva plantilla con valores por defecto
 */
function createNewTemplate(templateId, name, description) {
  const allTemplates = getAllTemplates();
  
  // Validar que no excedemos el máximo
  const templateCount = Object.keys(allTemplates).length;
  if (templateCount >= MAX_DEPARTMENTS) {
    throw new Error(`No se pueden crear más de ${MAX_DEPARTMENTS} plantillas de departamento`);
  }
  
  // Validar que el ID no existe
  if (allTemplates[templateId]) {
    throw new Error(`Ya existe una plantilla con el ID: ${templateId}`);
  }
  
  const newTemplate = {
    id: templateId,
    name: name || `Nuevo Departamento (${templateCount + 1} Mesas · 0 Puestos)`,
    description: description || '',
    config: {
      census: 0,
      title: `Elecciones a Junta de Personal · Nuevo Departamento`,
      organType: 'Junta de Personal',
      workCenter: '',
      department: '',
      location: '',
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      seats: 0,
      thresholdPercent: 5,
      quotientFormula: 'all_valid',
      notes: ''
    },
    mesas: []
  };
  
  allTemplates[templateId] = newTemplate;
  saveAllTemplates(allTemplates);
  return newTemplate;
}

/**
 * Obtener lista de plantillas para el menú desplegable
 */
function getTemplatesForMenu() {
  const allTemplates = getAllTemplates();
  const templateList = [];
  
  // Ordenar por nombre
  const sortedIds = Object.keys(allTemplates).sort((a, b) => {
    return allTemplates[a].name.localeCompare(allTemplates[b].name);
  });
  
  for (const id of sortedIds) {
    const template = allTemplates[id];
    templateList.push({
      id: template.id,
      name: template.name,
      description: template.description
    });
  }
  
  return templateList;
}

/**
 * Exportar para uso en el componente React
 * Esto reemplaza la función onLoadPreset original
 */
function getLoadPresetHandler(setConfig, setMesas) {
  return (templateId) => {
    const template = getTemplateById(templateId);
    if (template) {
      setConfig({ ...template.config });
      setMesas([...template.mesas]);
    } else {
      console.error(`Plantilla no encontrada: ${templateId}`);
    }
  };
}

/**
 * Inicializar el sistema de plantillas (solo primera vez)
 * Carga las plantillas por defecto si no hay ninguna guardada
 */
function initializeTemplates() {
  const savedTemplates = getAllTemplates();
  const isEmpty = Object.keys(savedTemplates).length === 0;
  
  if (isEmpty) {
    saveAllTemplates({ ...DEFAULT_TEMPLATES });
  }
}

/**
 * Restablecer plantillas a valores por defecto
 */
function resetToDefaults() {
  saveAllTemplates({ ...DEFAULT_TEMPLATES });
  return true;
}

/**
 * Exportar funciones para uso externo
 */
export {
  DEPARTMENT_TEMPLATES_STORAGE_KEY,
  MAX_DEPARTMENTS,
  DEFAULT_TEMPLATES,
  getAllTemplates,
  saveAllTemplates,
  getTemplateById,
  saveTemplate,
  deleteTemplate,
  createNewTemplate,
  getTemplatesForMenu,
  getLoadPresetHandler,
  initializeTemplates,
  resetToDefaults
};
