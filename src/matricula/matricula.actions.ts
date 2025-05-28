import { Request, Response } from 'express';
import { Materia } from './matricula.model';

// Crear Materia
export const crearMateria = async (req: Request, res: Response) => {
    try {
        const nuevaMateria = new Materia({
            ...req.body,
            activo: true
        });
        const materiaGuardada = await nuevaMateria.save();

        res.status(201).json(materiaGuardada);
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear la materia',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Obtener una materia por ID (solo activas)
export const obtenerMateria = async (req: Request, res: Response) => {
    try {
        const materia = await Materia.findOne({ _id: req.params.id, activo: true });

        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        res.json(materia);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener la materia',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Obtener todas las materias (solo activas)
export const obtenerMaterias = async (_req: Request, res: Response) => {
    try {
        const materias = await Materia.find({ activo: true });
        res.json(materias);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las materias',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Modificar Materia (solo activas)
export const modificarMateria = async (req: Request, res: Response) => {
    try {
        const materiaActualizada = await Materia.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            { ...req.body, activo: true }, // Aseguramos que no se pueda desactivar por esta vía
            { new: true, runValidators: true }
        );

        if (!materiaActualizada) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        res.json(materiaActualizada);
    } catch (error) {
        res.status(500).json({
            message: 'Error al modificar la materia',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

// Desactivar Materia (borrado lógico)
export const eliminarMateria = async (req: Request, res: Response) => {
    try {
        const materiaDesactivada = await Materia.findOneAndUpdate(
            { _id: req.params.id, activo: true },
            { activo: false },
            { new: true }
        );

        if (!materiaDesactivada) {
            return res.status(404).json({ message: 'Materia no encontrada o ya está eliminada' });
        }

        res.json({
            message: 'Materia eliminada correctamente',
            materia: materiaDesactivada
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar la materia',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};