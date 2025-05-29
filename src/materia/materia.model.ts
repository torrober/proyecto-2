import mongoose, { Schema, Document } from 'mongoose';
import { IEvaluacion, evaluacionSchema } from '../evaluacion/evaluacion.model';

export interface IMateria extends Document {
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
  departamento: string;
  semestreMalla: string;
  evaluaciones: IEvaluacion[];
  profesor: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const materiaSchema = new Schema<IMateria>({
  nombre: {
    type: String,
    required: [true, 'El nombre de la materia es requerido'],
    trim: true
  },
  codigo: {
    type: String,
    required: [true, 'El código de la materia es requerido'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción de la materia es requerida']
  },
  creditos: {
    type: Number,
    required: [true, 'Los créditos de la materia son requeridos'],
    min: [1, 'Los créditos deben ser al menos 1']
  },
  departamento: {
    type: String,
    required: [true, 'El departamento es requerido'],
    trim: true
  },
  semestreMalla: {
    type: String,
    required: [true, 'El semestre de proyección en malla es requerido'],
    trim: true
  },  evaluaciones: {
    type: [evaluacionSchema],
    required: [true, 'Las evaluaciones son requeridas'],    validate: {
      validator: function(evaluaciones: IEvaluacion[]) {
        const totalNotas = evaluaciones.reduce((sum, evaluacion) => sum + evaluacion.nota, 0);
        return totalNotas === 100;
      },
      message: 'La suma de las notas debe ser 100'
    }
  },
  profesor: {
    type: String,
    required: [true, 'El nombre del profesor es requerido'],
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Materia = mongoose.model<IMateria>('Materia', materiaSchema);