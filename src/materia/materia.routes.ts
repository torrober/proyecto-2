import { Router, Request, Response, NextFunction } from 'express';
import {
    createMateriaController,
    getMateriaController,
    getAllMateriasController,
    updateMateriaController,
    deleteMateriaController,
    healthCheck
} from './materia.controller';
import { verificarAdmin, verificarProfesorOAdmin, RequestWithUser } from '../middleware/auth.middleware';
import { ControllerResponse } from '../types/controller.types';

const router = Router();

const handleResponse = <T>(result: ControllerResponse<T>, res: Response, method: string) => {
  if (!result.success) {
    const statusCode = result.error?.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({ message: result.error });
    return;
  }
  
  const statusCodes: Record<string, number> = {
    'POST': 201,
    'GET': 200,
    'PUT': 200,
    'DELETE': 200
  };
  
  res.status(statusCodes[method]).json(result.data);
};

const wrapMiddleware = (middleware: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await middleware(req as RequestWithUser, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Health check endpoint
router.get('/health', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await healthCheck();
    handleResponse(result, res, req.method);
  } catch (error) {
    next(error);
  }
});

// Crear materia (Solo admin)
router.post('/', 
  wrapMiddleware(verificarAdmin),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, ...materiaData } = req.body;
      const result = await createMateriaController(materiaData);
      handleResponse(result, res, req.method);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener todas las materias
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getAllMateriasController();
    handleResponse(result, res, req.method);
  } catch (error) {
    next(error);
  }
});

// Obtener una materia específica
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getMateriaController(req.params.id);
    handleResponse(result, res, req.method);
  } catch (error) {
    next(error);
  }
});

// Actualizar materia (Admin o profesor asignado)
router.put('/:id', 
  wrapMiddleware(verificarProfesorOAdmin),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, ...updateData } = req.body;
      const result = await updateMateriaController(req.params.id, updateData);
      handleResponse(result, res, req.method);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar materia (Solo admin)
router.delete('/:id', 
  wrapMiddleware(verificarAdmin),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await deleteMateriaController(req.params.id);
      handleResponse(result, res, req.method);
    } catch (error) {
      next(error);
    }
  }
);

export default router;