import request from 'supertest';
import { app } from '../app';
import { Materia } from '../materia/materia.model';

describe('Materia E2E', () => {
  const baseMateria = {
    nombre: 'Física',
    codigo: 'FIS101',
    descripcion: 'Curso de física básica',
    creditos: 4,
    departamento: 'Ciencias',
    semestreMalla: '1',
    evaluaciones: [
      { titulo: 'Parcial', nota: 50 },
      { titulo: 'Final', nota: 50 }
    ],
    profesor: 'PROF123', // changed from 'Ana López' to 'PROF123' to match test user
    activo: true
  };

  beforeEach(async () => {
    await Materia.deleteMany({});
  });

  it('should create and get a materia', async () => {
    const res = await request(app)
      .post('/api/materias')
      .send({ user: { id: 'admin123', role: 'admin' }, ...baseMateria })
      .expect(201);
    expect(res.body.nombre).toBe('Física');

    const getRes = await request(app)
      .get(`/api/materias/${res.body._id}`)
      .expect(200);
    expect(getRes.body.codigo).toBe('FIS101');
  });

  it('should get all materias', async () => {
    await Materia.create(baseMateria);
    const res = await request(app).get('/api/materias').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a materia', async () => {
    const materia = await Materia.create(baseMateria);
    const res = await request(app)
      .put(`/api/materias/${materia._id}`)
      .send({ user: { id: 'PROF123', role: 'profesor' }, nombre: 'Física Avanzada' })
      .expect(200);
    expect(res.body.nombre).toBe('Física Avanzada');
  });

  it('should delete a materia', async () => {
    const materia = await Materia.create(baseMateria);
    const res = await request(app)
      .delete(`/api/materias/${materia._id}`)
      .send({ user: { id: 'admin123', role: 'admin' } })
      .expect(200);
    expect(res.body.activo).toBe(false);
  });

  it('should return 404 for non-existent materia', async () => {
    const res = await request(app)
      .get('/api/materias/000000000000000000000000')
      .expect(404);
    expect((res.body && res.body.message) || '').toMatch(/no encontrada/);
  });
});
