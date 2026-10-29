/**
 * Componente React para editar plantillas de departamento
 * Permite crear, editar y gestionar plantillas de departamento
 */

import React, { useState, useEffect } from 'react';
import {
  getAllTemplates,
  saveTemplate,
  deleteTemplate,
  createNewTemplate,
  getTemplatesForMenu,
  MAX_DEPARTMENTS
} from './department-templates.js';

// Iconos (simplificados - se usarán los mismos del proyecto)
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
</svg>;

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>;

const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg>;

const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
</svg>;

const DepartmentTemplateEditor = ({ onClose, onTemplateSelected, currentConfig, currentMesas }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const allTemplates = getTemplatesForMenu();
    setTemplates(allTemplates);
  };

  const handleSelectTemplate = (templateId) => {
    const allTemplates = getAllTemplates();
    const template = allTemplates[templateId];
    if (template) {
      setSelectedTemplate(template);
      if (onTemplateSelected) {
        onTemplateSelected(template);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setEditName(template.name);
    setEditDescription(template.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTemplate) return;

    const allTemplates = getAllTemplates();
    const updatedTemplate = {
      ...selectedTemplate,
      name: editName,
      description: editDescription
    };

    allTemplates[selectedTemplate.id] = updatedTemplate;
    saveTemplate(updatedTemplate);
    
    setIsEditing(false);
    setSelectedTemplate(null);
    loadTemplates();
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      try {
        deleteTemplate(templateToDelete);
        loadTemplates();
        setShowDeleteConfirm(false);
        setTemplateToDelete(null);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleCreateNew = () => {
    const templateCount = templates.length;
    if (templateCount >= MAX_DEPARTMENTS) {
      alert(`No se pueden crear más de ${MAX_DEPARTMENTS} plantillas de departamento`);
      return;
    }

    const newId = `custom_${Date.now()}`;
    const newTemplate = createNewTemplate(
      newId,
      `Nuevo Departamento (${templateCount + 1} Mesas)`,
      ''
    );
    
    setSelectedTemplate(newTemplate);
    setEditName(newTemplate.name);
    setEditDescription(newTemplate.description);
    setIsEditing(true);
    loadTemplates();
  };

  const handleSaveCurrentAsTemplate = () => {
    const templateCount = templates.length;
    if (templateCount >= MAX_DEPARTMENTS) {
      alert(`No se pueden crear más de ${MAX_DEPARTMENTS} plantillas de departamento`);
      return;
    }

    const newId = `saved_${Date.now()}`;
    const newTemplate = {
      id: newId,
      name: `Mi Configuración (${templateCount + 1})`,
      description: `Configuración guardada el ${new Date().toLocaleDateString('es-ES')}`,
      config: { ...currentConfig },
      mesas: [...currentMesas]
    };

    saveTemplate(newTemplate);
    loadTemplates();
    alert('Configuración actual guardada como nueva plantilla');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="bg-[#FBEAE4] border-b border-[#F0C4B6] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif font-bold text-sm text-[#1D1B1A] uppercase tracking-wide">
              Gestor de Plantillas de Departamento
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrentAsTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2F6B4F] hover:bg-[#23533D] text-white text-xs font-bold shadow-2xs transition"
              title="Guardar configuración actual como nueva plantilla"
            >
              <SaveIcon />
              <span>Guardar Actual</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#BB2B09] hover:bg-[#8A2007] text-white text-xs font-bold shadow-2xs transition"
              title="Crear nueva plantilla"
            >
              <PlusIcon />
              <span>Nueva Plantilla</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#FFFDF9] hover:bg-white text-[#5C544F] hover:text-[#BB2B09] border border-[#E3D9CF] transition"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-4">
          {isEditing ? (
            <div className="bg-[#F6F2EC] rounded-lg border border-[#E3D9CF] p-4">
              <h3 className="font-bold text-[#1D1B1A] mb-4">
                {selectedTemplate?.id ? 'Editar Plantilla' : 'Nueva Plantilla'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
                    Nombre de la Plantilla
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-medium"
                    placeholder="Ej: Dpto. Orihuela (3 Mesas · 23 Puestos)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-medium"
                    placeholder="Ej: H. Vega Baja, C.S. Orihuela, C.S. Callosa/Almoradí"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#BB2B09] hover:bg-[#8A2007] text-white text-xs font-bold shadow-2xs transition"
                  >
                    <SaveIcon />
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F6F2EC] hover:bg-[#ECE4DB] text-[#5C544F] text-xs font-bold border border-[#E3D9CF] transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#5C544F]">
                Selecciona una plantilla para cargarla o edítala. Puedes crear hasta {MAX_DEPARTMENTS} plantillas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => {
                  const allTemplates = getAllTemplates();
                  const fullTemplate = allTemplates[template.id];
                  const isDefault = [
                    'orihuela_3', 'torrevieja_3', 'elche_4', 'alcoi_2', 'alicante_5'
                  ].includes(template.id);

                  return (
                    <div
                      key={template.id}
                      className="bg-[#F6F2EC] rounded-lg border border-[#E3D9CF] p-3 hover:border-[#BB2B09] transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <button
                            onClick={() => handleSelectTemplate(template.id)}
                            className="text-left w-full"
                          >
                            <h4 className="font-bold text-[#1D1B1A] text-sm mb-1">
                              {template.name}
                            </h4>
                            <p className="text-xs text-[#5C544F] truncate">
                              {template.description || 'Sin descripción'}
                            </p>
                            <p className="text-xs text-[#8A2007] mt-1">
                              {fullTemplate.mesas?.length || 0} mesas · {fullTemplate.config?.seats || 0} puestos
                            </p>
                          </button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleEditTemplate(fullTemplate)}
                            className="p-1.5 rounded bg-[#FFFDF9] hover:bg-[#FBEAE4] text-[#BB2B09] border border-[#E3D9CF] transition"
                            title="Editar plantilla"
                          >
                            <EditIcon />
                          </button>
                          {!isDefault && (
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-1.5 rounded bg-[#FFFDF9] hover:bg-[#FEF2F2] text-[#991B1B] border border-[#E3D9CF] transition"
                              title="Eliminar plantilla"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] p-5 max-w-sm">
              <h3 className="font-bold text-[#1D1B1A] mb-3">
                ¿Eliminar plantilla?
              </h3>
              <p className="text-sm text-[#5C544F] mb-4">
                Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta plantilla?
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F6F2EC] hover:bg-[#ECE4DB] text-[#5C544F] text-xs font-bold border border-[#E3D9CF] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold shadow-2xs transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentTemplateEditor;
