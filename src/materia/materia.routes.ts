import { Router, Request, Response, NextFunction } from 'express';
import {
    createMateriaController,
    getMateriaController,
    getAllMateriasController,
    updateMateriaController,
    deleteMateriaController,
    healthCheck
} from './matricula.controller';
import { RequestWithUser } from '../middleware/auth.middleware';

const router = Router();

const wrapMiddleware = (handler: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req as RequestWithUser, res, next);
        } catch (error) {
            next(error);
        }
    };
};

// Health check endpoint
router.get('/health', wrapMiddleware(healthCheck));

// Ruta para crear una nueva materia (Solo admin)
router.post('/', 
    wrapMiddleware(createMateriaController[0]),
    wrapMiddleware(createMateriaController[1]));

// Ruta para obtener todas las materias
router.get('/', wrapMiddleware(getAllMateriasController));

// Ruta para obtener una materia específica
router.get('/:id', wrapMiddleware(getMateriaController));

// Ruta para actualizar una materia (Admin o profesor asignado)
router.put('/:id',
    wrapMiddleware(updateMateriaController[0]),
    wrapMiddleware(updateMateriaController[1]));

// Ruta para eliminar una materia (Solo admin)
router.delete('/:id',
    wrapMiddleware(deleteMateriaController[0]),
    wrapMiddleware(deleteMateriaController[1]));

export default router;