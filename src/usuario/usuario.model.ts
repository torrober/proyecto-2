import mongoose, { Schema, Document } from 'mongoose';

export interface IUsuario extends Document {
    nombre: string;
    email: string;
    role: 'admin' | 'profesor' | 'estudiante';
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const usuarioSchema = new Schema<IUsuario>({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['admin', 'profesor', 'estudiante'],
        required: [true, 'El rol es requerido']
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);
