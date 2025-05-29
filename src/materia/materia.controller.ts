import { 
  crearMateria, 
  obtenerMateria, 
  obtenerMaterias, 
  modificarMateria, 
  eliminarMateria 
} from './materia.actions';
import { RequestWithUser } from '../middleware/auth.middleware';
import { ControllerResponse } from '../types/controller.types';
import { IMateria } from './materia.model';

export const createMateriaController = async (req: RequestWithUser): Promise<ControllerResponse<IMateria>> => {
  try {
    const { user, ...materiaData } = req.body;
    const materiaCreada = await crearMateria(materiaData);
    return {
      success: true,
      data: materiaCreada,
      statusCode: 201
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      statusCode: 500
    };
  }
};

export const getMateriaController = async (req: RequestWithUser): Promise<ControllerResponse<IMateria>> => {
  try {
    const materia = await obtenerMateria(req.params.id);
    if (!materia) {
      return {
        success: false,
        error: 'Materia no encontrada',
        statusCode: 404
      };
    }
    return {
      success: true,
      data: materia,
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      statusCode: 500
    };
  }
};

export const getAllMateriasController = async (): Promise<ControllerResponse<IMateria[]>> => {
  try {
    const materias = await obtenerMaterias();
    return {
      success: true,
      data: materias,
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      statusCode: 500
    };
  }
};

export const updateMateriaController = async (req: RequestWithUser): Promise<ControllerResponse<IMateria>> => {
  try {
    const { user, ...updateData } = req.body;
    const materiaActualizada = await modificarMateria(req.params.id, updateData);
    if (!materiaActualizada) {
      return {
        success: false,
        error: 'Materia no encontrada',
        statusCode: 404
      };
    }
    return {
      success: true,
      data: materiaActualizada,
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      statusCode: 500
    };
  }
};

export const healthCheck = async (): Promise<ControllerResponse<{ status: string }>> => {
  return {
    success: true,
    data: { status: 'ok' },
    statusCode: 200
  };
};

export const deleteMateriaController = async (req: RequestWithUser): Promise<ControllerResponse<IMateria>> => {
  try {
    const materiaEliminada = await eliminarMateria(req.params.id);
    if (!materiaEliminada) {
      return {
        success: false,
        error: 'Materia no encontrada o ya está eliminada',
        statusCode: 404
      };
    }
    return {
      success: true,
      data: materiaEliminada,
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      statusCode: 500
    };
  }
};