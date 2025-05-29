import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluacion {
  titulo: string;
  nota: number;
}

export const evaluacionSchema = new Schema<IEvaluacion>({
  titulo: {
    type: String,
    required: [true, 'El título de la evaluación es requerido'],
    trim: true
  },
  nota: {
    type: Number,
    required: [true, 'La nota de la evaluación es requerida'],
    min: [0, 'La nota no puede ser menor a 0'],
    max: [100, 'La nota no puede ser mayor a 100']
  }
});

export const Evaluacion = mongoose.model<IEvaluacion>('Evaluacion', evaluacionSchema);
