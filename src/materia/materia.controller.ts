import { 
  crearMateria, 
  obtenerMateria, 
  obtenerMaterias, 
  modificarMateria, 
  eliminarMateria 
} from './materia.actions';
import { ControllerResponse } from '../types/controller.types';
import { IMateria } from './materia.model';

export const createMateriaController = async (materiaData: Partial<IMateria>): Promise<ControllerResponse<IMateria>> => {
  try {
    const materiaCreada = await crearMateria(materiaData);
    return {
      success: true,
      data: materiaCreada
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getMateriaController = async (id: string): Promise<ControllerResponse<IMateria>> => {
  try {
    const materia = await obtenerMateria(id);
    if (!materia) {
      return {
        success: false,
        error: 'Materia no encontrada'
      };
    }
    return {
      success: true,
      data: materia
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getAllMateriasController = async (): Promise<ControllerResponse<IMateria[]>> => {
  try {
    const materias = await obtenerMaterias();
    return {
      success: true,
      data: materias
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const updateMateriaController = async (
  id: string, 
  updateData: Partial<IMateria>
): Promise<ControllerResponse<IMateria>> => {
  try {
    const materiaActualizada = await modificarMateria(id, updateData);
    if (!materiaActualizada) {
      return {
        success: false,
        error: 'Materia no encontrada'
      };
    }
    return {
      success: true,
      data: materiaActualizada
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const healthCheck = async (): Promise<ControllerResponse<{ status: string }>> => {
  return {
    success: true,
    data: { status: 'ok' }
  };
};

export const deleteMateriaController = async (id: string): Promise<ControllerResponse<IMateria>> => {
  try {
    const materiaEliminada = await eliminarMateria(id);
    if (!materiaEliminada) {
      return {
        success: false,
        error: 'Materia no encontrada o ya está eliminada'
      };
    }
    return {
      success: true,
      data: materiaEliminada
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};