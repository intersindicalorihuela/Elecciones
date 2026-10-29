# Sistema de Plantillas de Departamento Editables

## Descripción

Se ha implementado un sistema completo para gestionar plantillas de departamento editables en el simulador de elecciones sindicales. Este sistema permite:

1. **Cargar plantillas predefinidas** - Las 5 plantillas originales (Orihuela, Torrevieja, Elche, Alcoi, Alicante)
2. **Editar plantillas existentes** - Modificar nombre, descripción y configuración
3. **Crear nuevas plantillas** - Hasta 24 departamentos diferentes
4. **Guardar en localStorage** - Las plantillas personalizadas persisten entre sesiones
5. **Eliminar plantillas** - Solo las plantillas creadas por el usuario (no las predefinidas)

## Archivos Creados

### 1. `assets/template-manager.js`
El núcleo del sistema. Proporciona:
- `DepartmentTemplateManager` - Objeto global con todas las funciones
- `getAllTemplates()` - Obtener todas las plantillas
- `saveTemplate(template)` - Guardar/actualizar una plantilla
- `deleteTemplate(templateId)` - Eliminar una plantilla
- `createNewTemplate(id, name, description)` - Crear nueva plantilla
- `getTemplatesForMenu()` - Obtener lista para el menú
- `loadPreset(templateId, setConfig, setMesas)` - Cargar una plantilla

### 2. `assets/department-templates.js`
Módulo ES6 con las mismas funciones, para importar en componentes React.

### 3. `assets/DepartmentTemplateEditor.jsx`
Componente React para la interfaz de edición de plantillas (opcional, para integración futura).

## Integración con el Menú Existente

El menú "Plantillas Dptos. Salud" en el index.html ya está configurado para:

1. **Mostrar las plantillas guardadas** - Se cargan desde localStorage
2. **Cargar plantillas** - Al hacer clic en una plantilla, se carga su configuración
3. **Editar plantillas** - Botón de edición para modificar nombre y descripción
4. **Crear nuevas** - Botón "Nueva Plantilla" para crear desde cero
5. **Guardar actual** - Botón para guardar la configuración actual como nueva plantilla

## Uso

### Desde JavaScript (en el index.html minificado)

El sistema ya está integrado. Simplemente:

```javascript
// Cargar una plantilla
window.DepartmentTemplateManager.loadPreset('orihuela_3', setConfig, setMesas);

// Obtener todas las plantillas
const templates = window.DepartmentTemplateManager.getAllTemplates();

// Crear una nueva plantilla
const newTemplate = window.DepartmentTemplateManager.createNewTemplate(
  'mi_departamento_1',
  'Mi Departamento (2 Mesas)',
  'Configuración personalizada'
);

// Guardar una plantilla editada
window.DepartmentTemplateManager.saveTemplate(updatedTemplate);

// Eliminar una plantilla
window.DepartmentTemplateManager.deleteTemplate('mi_departamento_1');
```

### Desde React (si se usa el componente)

```jsx
import DepartmentTemplateEditor from './assets/DepartmentTemplateEditor.jsx';

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [config, setConfig] = useState(initialConfig);
  const [mesas, setMesas] = useState(initialMesas);

  return (
    <>
      <button onClick={() => setShowEditor(true)}>
        Gestionar Plantillas
      </button>
      
      {showEditor && (
        <DepartmentTemplateEditor
          onClose={() => setShowEditor(false)}
          onTemplateSelected={(template) => {
            setConfig({ ...template.config });
            setMesas([...template.mesas]);
          }}
          currentConfig={config}
          currentMesas={mesas}
        />
      )}
    </>
  );
}
```

## Estructura de una Plantilla

```javascript
{
  id: 'identificador_unico',
  name: 'Nombre de la plantilla',
  description: 'Descripción opcional',
  config: {
    census: 0,
    title: 'Título de las elecciones',
    organType: 'Junta de Personal',
    workCenter: 'Centro de trabajo',
    department: 'Nombre del departamento',
    location: 'Localización',
    date: '2024-01-01',
    seats: 23,
    thresholdPercent: 5,
    quotientFormula: 'all_valid',
    notes: 'Notas adicionales'
  },
  mesas: [
    {
      id: 'm1',
      number: 1,
      name: 'Mesa 1 - Nombre',
      census: 500,
      blankVotes: 10,
      nullVotes: 5,
      votesByCandidacy: {
        'cand-iv': 100,
        'cand-ccoo': 80,
        // ... otros candidatos
      }
    }
    // ... más mesas
  ]
}
```

## Limitaciones

- **Máximo 24 plantillas** - Incluyendo las 5 predefinidas
- **Plantillas predefinidas** - No se pueden eliminar (orihuela_3, torrevieja_3, elche_4, alcoi_2, alicante_5)
- **Almacenamiento** - Usa localStorage, limitado por el navegador (generalmente ~5MB)

## Persistencia

Las plantillas se guardan en `localStorage` con la clave `intersindical_department_templates_v2`. Esto significa:

- ✅ Las plantillas persisten entre sesiones
- ✅ Las plantillas persisten después de cerrar el navegador
- ❌ Las plantillas NO se comparten entre dispositivos
- ❌ Las plantillas NO se sincronizan en la nube

## Migración desde la versión anterior

El sistema detecta automáticamente si es la primera vez que se usa y carga las plantillas por defecto. No se requiere migración manual.

## Personalización

Para agregar más plantillas por defecto, editar el archivo `assets/template-manager.js` y agregar nuevas entradas al objeto `DEFAULT_TEMPLATES`.

## Solución de Problemas

Si las plantillas no se guardan:
1. Verificar que el navegador soporta localStorage
2. Verificar que no se ha alcanzado el límite de almacenamiento
3. Verificar que no hay errores en la consola del navegador

Si el menú no muestra las plantillas:
1. Asegurarse de que el archivo `template-manager.js` se carga antes del código que usa las plantillas
2. Verificar que no hay conflictos con otros scripts
