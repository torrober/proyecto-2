import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { Materia } from '../matricula/matricula.model';

/**
 * Represents the possible roles a user can have in the system.
 * Authentication and role validation is handled by an external auth service.
 */
export type UserRole = 'admin' | 'profesor' | 'estudiante';

/**
 * Interface for request objects that have been authenticated by the external auth service.
 * JWT validation is performed before requests reach this microservice, and the validated
 * user information is attached to the request object.
 */
export interface RequestWithUser extends Request {
  user?: {
    id: string;      // User ID validated by external auth
    role: UserRole;  // Role validated by external auth
  };
}

// Middleware functions below assume JWT validation has been done by the external auth service
export const verificarAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error en la verificación de permisos de administrador',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

export const verificarProfesorOAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    const esAdmin = req.user?.role === 'admin';
    const esProfesor = req.user?.role === 'profesor' && materia.profesorId?.toString() === req.user?.id;

    if (!esAdmin && !esProfesor) {
      return res.status(403).json({ message: 'Acceso denegado. Debe ser administrador o profesor asignado a la materia.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error en la verificación de permisos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
