# Instrucciones de Implementación

## Cambios Realizados

Se ha implementado un sistema completo de plantillas de departamento editables para el simulador de elecciones sindicales. A continuación se detallan los cambios y cómo implementarlos.

## Archivos Nuevos

1. **`assets/template-manager.js`** - Sistema principal de gestión de plantillas
2. **`assets/department-templates.js`** - Módulo ES6 para importar en React
3. **`assets/DepartmentTemplateEditor.jsx`** - Componente React para interfaz de edición (opcional)
4. **`INSTRUCCIONES-PLANTILLAS.md`** - Documentación del sistema

## Modificaciones al index.html

El archivo `index.html` ya contiene el código minificado de la aplicación. Para integrar el nuevo sistema de plantillas editables, se necesita:

### Opción 1: Modificar el código minificado (Recomendado)

Buscar y reemplazar la función `onLoadPreset` en el código minificado para que use el nuevo sistema.

**Buscar:**
```javascript
onLoadPreset: (e20) => {
  e20 === `orihuela_3` ? (r5({ ... }), l6([ ... ])) : 
  e20 === `torrevieja_3` ? (r5({ ... }), l6([ ... ])) : 
  ...
}
```

**Reemplazar con:**
```javascript
onLoadPreset: (e20) => {
  // Usar el nuevo sistema de plantillas
  if (window.DepartmentTemplateManager) {
    window.DepartmentTemplateManager.loadPreset(e20, r5, l6);
  } else {
    // Fallback a las plantillas originales
    e20 === `orihuela_3` ? (r5({ ... }), l6([ ... ])) : 
    e20 === `torrevieja_3` ? (r5({ ... }), l6([ ... ])) : 
    ...
  }
}
```

### Opción 2: Cargar el script externo (Más simple)

Agregar el script `template-manager.js` al final del `<body>` en el index.html:

```html
<!-- Antes de cerrar el body -->
<script src="./assets/template-manager.js"></script>
```

Luego, modificar la función `onLoadPreset` para que use el nuevo sistema:

```javascript
onLoadPreset: (e20) => {
  if (window.DepartmentTemplateManager) {
    const template = window.DepartmentTemplateManager.getTemplateById(e20);
    if (template) {
      r5({ ...template.config });
      l6([...template.mesas]);
    }
  }
}
```

## Integración con el Menú Desplegable

El menú "Plantillas Dptos. Salud" debe ser modificado para:

1. **Mostrar todas las plantillas** (incluyendo las personalizadas)
2. **Permitir editar plantillas**
3. **Permitir crear nuevas plantillas**
4. **Permitir eliminar plantillas personalizadas**

### Código del Menú Modificado

```javascript
// Estado para el menú
const [showTemplatesMenu, setShowTemplatesMenu] = useState(false);
const [showEditor, setShowEditor] = useState(false);

// Función para cargar plantillas
const loadPreset = (templateId) => {
  if (window.DepartmentTemplateManager) {
    const template = window.DepartmentTemplateManager.getTemplateById(templateId);
    if (template) {
      setConfig({ ...template.config });
      setMesas([...template.mesas]);
      setShowTemplatesMenu(false);
    }
  }
};

// Menú desplegable
<div className="relative">
  <button
    onClick={() => setShowTemplatesMenu(!showTemplatesMenu)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFDF9] hover:bg-white text-xs font-semibold text-[#1D1B1A] border border-[#E3D9CF] shadow-2xs transition"
  >
    <span>Plantillas Dptos. Salud</span>
    <ChevronDownIcon className="w-3 h-3 text-[#5C544F]" />
  </button>
  
  {showTemplatesMenu && (
    <div
      className="absolute right-0 mt-1.5 w-80 bg-[#FFFDF9] rounded-lg shadow-xl border border-[#E3D9CF] py-1 text-[#1D1B1A] z-50 text-xs"
      onMouseLeave={() => setShowTemplatesMenu(false)}
    >
      {/* Cabecera del menú */}
      <div className="px-3 py-1.5 font-bold uppercase text-[10px] text-[#8A2007] tracking-wider border-b border-[#ECE4DB] flex items-center justify-between">
        <span>Gestor de Plantillas</span>
        <button
          onClick={() => {
            setShowTemplatesMenu(false);
            setShowEditor(true);
          }}
          className="text-[#BB2B09] hover:text-[#8A2007]"
          title="Gestionar plantillas"
        >
          <SettingsIcon className="w-3 h-3" />
        </button>
      </div>
      
      {/* Lista de plantillas */}
      {window.DepartmentTemplateManager?.getTemplatesForMenu().map(template => (
        <button
          key={template.id}
          onClick={() => loadPreset(template.id)}
          className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col border-t border-[#ECE4DB]"
        >
          <span className="font-bold text-[#1D1B1A]">{template.name}</span>
          <span className="text-[11px] text-[#5C544F]">{template.description}</span>
          <span className="text-[10px] text-[#8A2007]">
            {template.mesasCount} mesas · {template.seats} puestos
          </span>
        </button>
      ))}
    </div>
  )}
  
  {/* Editor de plantillas */}
  {showEditor && (
    <DepartmentTemplateEditor
      onClose={() => setShowEditor(false)}
      onTemplateSelected={(template) => {
        setConfig({ ...template.config });
        setMesas([...template.mesas]);
        setShowEditor(false);
      }}
      currentConfig={config}
      currentMesas={mesas}
    />
  )}
</div>
```

## Implementación Recomendada

Dado que el `index.html` está minificado, la forma más sencilla de implementar el sistema es:

1. **Cargar el script `template-manager.js`** al final del `<body>`
2. **Modificar el menú de plantillas** para que use `window.DepartmentTemplateManager`
3. **Agregar botones de gestión** (Nueva Plantilla, Guardar Actual, etc.)

### Paso a Paso

1. **Copiar los archivos nuevos** a la carpeta `assets/`:
   - `template-manager.js`
   - `department-templates.js`
   - `DepartmentTemplateEditor.jsx`

2. **Modificar el index.html**:
   - Agregar `<script src="./assets/template-manager.js"></script>` antes de `</body>`
   - Modificar la función `onLoadPreset` para usar el nuevo sistema

3. **Probar la implementación**:
   - Abrir el index.html en un navegador
   - Verificar que las plantillas se cargan correctamente
   - Verificar que se pueden crear nuevas plantillas
   - Verificar que las plantillas persisten después de recargar

## Pruebas

Para verificar que el sistema funciona correctamente:

1. **Cargar plantillas predefinidas**:
   - Hacer clic en "Plantillas Dptos. Salud"
   - Seleccionar cada una de las plantillas predefinidas
   - Verificar que se carga la configuración correcta

2. **Crear nueva plantilla**:
   - Configurar manualmente un departamento
   - Hacer clic en "Guardar Actual" en el menú de plantillas
   - Verificar que la nueva plantilla aparece en el menú

3. **Editar plantilla**:
   - Seleccionar una plantilla
   - Modificar su nombre o descripción
   - Guardar los cambios
   - Verificar que los cambios persisten

4. **Persistencia**:
   - Crear una plantilla
   - Recargar la página
   - Verificar que la plantilla sigue disponible

## Notas Técnicas

- El sistema usa `localStorage` para almacenar las plantillas
- Las plantillas predefinidas no se pueden eliminar
- Máximo 24 plantillas (incluyendo las predefinidas)
- Las plantillas se ordenan alfabéticamente por nombre

## Solución de Problemas

**Problema: Las plantillas no se guardan**
- Verificar que el navegador soporta localStorage
- Verificar que no hay errores en la consola
- Verificar que el script `template-manager.js` se carga correctamente

**Problema: El menú no muestra las plantillas personalizadas**
- Verificar que `window.DepartmentTemplateManager` está definido
- Verificar que `getTemplatesForMenu()` devuelve las plantillas
- Verificar que el menú se actualiza después de crear una plantilla

**Problema: Las plantillas predefinidas no aparecen**
- Verificar que `initializeTemplates()` se ejecuta al cargar
- Verificar que no hay conflictos con el código existente

## Versiones

- **v1.0**: Sistema básico de plantillas editables
- **v2.0**: Integración con el menú existente + persistencia

## Compatibilidad

El sistema es compatible con:
- Navegadores modernos (Chrome, Firefox, Edge, Safari)
- Internet Explorer 11 (con polyfills para ES6)
- Dispositivos móviles

## Seguridad

- Las plantillas se guardan localmente en el navegador
- No se envía ninguna información a servidores externos
- Las plantillas son específicas para cada usuario/dispositivo
