import mongoose, { Schema, Document } from 'mongoose';

export interface IMateria extends Document {
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
  profesorId?: mongoose.Types.ObjectId;
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
  profesorId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Materia = mongoose.model<IMateria>('Materia', materiaSchema);