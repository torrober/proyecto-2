import { createMateriaController, getMateriaController, getAllMateriasController, updateMateriaController, deleteMateriaController } from '../materia/materia.controller';
import { Materia } from '../materia/materia.model';

describe('Materia Controller', () => {
  const mockMateria = {
    nombre: 'Matemáticas',
    codigo: 'MAT101',
    descripcion: 'Curso de matemáticas básicas',
    creditos: 4,
    departamento: 'Ciencias',
    semestreMalla: '1',
    evaluaciones: [
      { titulo: 'Parcial', nota: 50 },
      { titulo: 'Final', nota: 50 }
    ],
    profesor: 'Juan Pérez',
    activo: true
  };

  beforeEach(async () => {
    await Materia.deleteMany({});
  });

  it('should create a materia', async () => {
    const res = await createMateriaController(mockMateria);
    expect(res.success).toBe(true);
    expect(res.data).toHaveProperty('_id');
    expect(res.data?.nombre).toBe('Matemáticas');
  });

  it('should get a materia by id', async () => {
    const { data } = await createMateriaController(mockMateria);
    const res = await getMateriaController(String(data!._id));
    expect(res.success).toBe(true);
    expect(res.data?.codigo).toBe('MAT101');
  });

  it('should get all materias', async () => {
    await createMateriaController(mockMateria);
    const res = await getAllMateriasController();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data!.length).toBeGreaterThan(0);
  });

  it('should update a materia', async () => {
    const { data } = await createMateriaController(mockMateria);
    const res = await updateMateriaController(String(data!._id), { nombre: 'Álgebra' });
    expect(res.success).toBe(true);
    expect(res.data?.nombre).toBe('Álgebra');
  });

  it('should delete a materia', async () => {
    const { data } = await createMateriaController(mockMateria);
    const res = await deleteMateriaController(String(data!._id));
    expect(res.success).toBe(true);
    expect(res.data?.activo).toBe(false);
  });

  it('should return error for non-existent materia', async () => {
    const res = await getMateriaController('000000000000000000000000');
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/no encontrada/);
  });
});
