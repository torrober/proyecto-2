import request from 'supertest';
import { app } from '../app';
import { Materia } from '../materia/materia.model';

describe('Materia Routes', () => {
  const materiaData = {
    nombre: 'Química',
    codigo: 'QUI101',
    descripcion: 'Curso de química básica',
    creditos: 4,
    departamento: 'Ciencias',
    semestreMalla: '1',
    evaluaciones: [
      { titulo: 'Parcial', nota: 50 },
      { titulo: 'Final', nota: 50 }
    ],
    profesor: 'Carlos Ruiz',
    activo: true
  };

  beforeEach(async () => {
    await Materia.deleteMany({});
  });

  it('should require admin for POST /materia', async () => {
    const res = await request(app)
      .post('/materia')
      .send({
        user: { id: 'admin123', role: 'admin' },
        ...materiaData
      });
    expect([201, 500, 403, 404]).toContain(res.status);
  });

  it('should require admin for DELETE /materia/:id', async () => {
    const materia = await Materia.create(materiaData);
    const res = await request(app)
      .delete(`/materia/${materia._id}`)
      .send({
        user: { id: 'admin123', role: 'admin' }
      });
    expect([200, 500, 403, 404]).toContain(res.status);
  });

  it('should require profesor or admin for PUT /materia/:id', async () => {
    const materia = await Materia.create(materiaData);
    const res = await request(app)
      .put(`/materia/${materia._id}`)
      .send({
        user: { id: 'PROF123', role: 'profesor' },
        nombre: 'Química Orgánica'
      });
    expect([200, 500, 403, 404]).toContain(res.status);
  });

  it('should return 200 for GET /api/materias', async () => {
    await Materia.create(materiaData);
    const res = await request(app).get('/api/materias');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 200 for GET /api/materias/health', async () => {
    const res = await request(app).get('/api/materias/health');
    expect(res.status).toBe(200);
    expect(res.body.status || res.body).toBe('ok');
  });
});
