import { Response, NextFunction } from 'express';
import { Request } from 'express';
import { Materia } from '../materia/materia.model';

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
    if (req.body.user?.role !== 'admin') {
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

export const verificarProfesorAsignado = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    if (req.body.user?.role !== 'profesor') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere ser profesor.' });
    }

    if (!req.body.user?.id) {
      return res.status(401).json({ message: 'Usuario no autenticado correctamente.' });
    }    // Aquí verificamos si el profesor está asignado a la materia por su nombre
    const profesorAsignado = await Materia.findOne({
      _id: req.params.id,
      profesor: req.body.user.id // Usamos el ID como el nombre del profesor
    });

    if (!profesorAsignado) {
      return res.status(403).json({ message: 'Acceso denegado. No es el profesor asignado a esta materia.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error en la verificación de permisos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Middleware combinado para verificar si es admin o profesor asignado
export const verificarProfesorOAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.body.user?.role === 'admin') {
      return next();
    }

    // Si no es admin, verificar si es el profesor asignado
    return verificarProfesorAsignado(req, res, next);
  } catch (error) {
    return res.status(500).json({
      message: 'Error en la verificación de permisos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
