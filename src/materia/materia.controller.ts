import { Response } from 'express';
import { 
  crearMateria, 
  obtenerMateria, 
  obtenerMaterias, 
  modificarMateria, 
  eliminarMateria 
} from './materia.actions';
import { verificarAdmin, verificarProfesorOAdmin, RequestWithUser } from '../middleware/auth.middleware';

const handleControllerError = (res: Response, message: string, error: unknown) => {
  return res.status(500).json({
    message,
    error: error instanceof Error ? error.message : 'Error desconocido'
  });
};

export const createMateriaController = [verificarAdmin, async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    await crearMateria(req, res);
  } catch (error) {
    handleControllerError(res, 'Error en el controlador al crear materia', error);
  }
}];

export const getMateriaController = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    await obtenerMateria(req, res);
  } catch (error) {
    handleControllerError(res, 'Error en el controlador al obtener materia', error);
  }
};

export const getAllMateriasController = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    await obtenerMaterias(req, res);
  } catch (error) {
    handleControllerError(res, 'Error en el controlador al obtener materias', error);
  }
};

export const updateMateriaController = [verificarProfesorOAdmin, async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    await modificarMateria(req, res);
  } catch (error) {
    handleControllerError(res, 'Error en el controlador al modificar materia', error);
  }
}];

export const healthCheck = async (_req: RequestWithUser, res: Response): Promise<void> => {
    res.status(200).json({ status: 'ok' });
};

export const deleteMateriaController = [verificarAdmin, async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    await eliminarMateria(req, res);
  } catch (error) {
    handleControllerError(res, 'Error en el controlador al eliminar materia', error);
  }
}];