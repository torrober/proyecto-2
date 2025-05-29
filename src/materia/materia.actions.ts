import { Materia } from './materia.model';
import { IMateria } from './materia.model';

// Crear Materia
export const crearMateria = async (materiaData: Partial<IMateria>): Promise<IMateria> => {
    const nuevaMateria = new Materia({
        ...materiaData,
        activo: true
    });
    return await nuevaMateria.save();
};

// Obtener una materia por ID (solo activas)
export const obtenerMateria = async (id: string): Promise<IMateria | null> => {
    return await Materia.findOne({ _id: id, activo: true });
};

// Obtener todas las materias (solo activas)
export const obtenerMaterias = async (): Promise<IMateria[]> => {
    return await Materia.find({ activo: true });
};

// Modificar Materia (solo activas)
export const modificarMateria = async (id: string, materiaData: Partial<IMateria>): Promise<IMateria | null> => {
    return await Materia.findOneAndUpdate(
        { _id: id, activo: true },
        { ...materiaData, activo: true },
        { new: true, runValidators: true }
    );
};

// Desactivar Materia (borrado lógico)
export const eliminarMateria = async (id: string): Promise<IMateria | null> => {
    return await Materia.findOneAndUpdate(
        { _id: id, activo: true },
        { activo: false },
        { new: true }
    );
};