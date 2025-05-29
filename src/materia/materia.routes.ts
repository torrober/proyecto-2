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

const wrapHandler = (
  handler: (req: RequestWithUser) => Promise<ControllerResponse<any>>
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await handler(req as RequestWithUser);
      res.status(result.statusCode).json(
        result.success ? 
          result.data : 
          { message: result.error }
      );
    } catch (error) {
      next(error);
    }
  };
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
router.get('/health', wrapHandler(() => healthCheck()));

// Crear materia (Solo admin)
router.post('/', 
  wrapMiddleware(verificarAdmin),
  wrapHandler(createMateriaController)
);

// Obtener todas las materias
router.get('/', wrapHandler(getAllMateriasController));

// Obtener una materia específica
router.get('/:id', wrapHandler(getMateriaController));

// Actualizar materia (Admin o profesor asignado)
router.put('/:id',
  wrapMiddleware(verificarProfesorOAdmin),
  wrapHandler(updateMateriaController)
);

// Eliminar materia (Solo admin)
router.delete('/:id',
  wrapMiddleware(verificarAdmin),
  wrapHandler(deleteMateriaController)
);

export default router;