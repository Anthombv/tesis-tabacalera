import mongoose, { mongo, Schema } from "mongoose";
import { Auditory, Backup, Cajas, Comentario, Solicitude, User } from "../types";

const UserSchema = new mongoose.Schema<User>(
  {
    userName: { type: String },
    password: { type: String },
    email: { type: String },
    department: { type: String },
    role: { type: Number },
    name: { type: String },
    identificationCard: { type: String },
    dateBirth: { type: String },
    age: { type: Number },
  },
  { timestamps: true }
);

// Duplicate the ID field.
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set("toJSON", {
  virtuals: true,
});

export const UserModel =
  mongoose.models.Users || mongoose.model("Users", UserSchema);

const ComentarioSchema = new mongoose.Schema<Comentario>(
  {
    //Solicitante
    usuario: { type: UserSchema },
    mensaje: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
ComentarioSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ComentarioSchema.set("toJSON", {
  virtuals: true,
});

const CajasSchema = new mongoose.Schema<Cajas>(
  {
    //Solicitante
    NumeroDeCaja: { type: Number },
    corte: { type: String },
    lote: { type: String },
    variedad: { type: String },
    cantidad: { type: Number },
    anioCosecha: { type: Number },
    pesoBruto: { type: Number },
    pesoNeto: { type: Number },
    valor: { type: Number },
    calidad: { type: String },
    casona: { type: String },
    aposento: { type: String },
    cometarios: { type: [ComentarioSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
CajasSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CajasSchema.set("toJSON", {
  virtuals: true,
});

const SolicitudeSchema = new mongoose.Schema<Solicitude>(
  {
    number: { type: Number },
    fecha: { type: String },
    solicitante: { type: String },
    informacionCurador: { type: String },
    cajas: { type: [CajasSchema] },
    estadoCurador: { type: String },
    estadoEmpacador: { type: String },
    EstadoAdministrador: { type: String },
    EstadoBodeguero: { type: String },
    EstadoMulling: { type: String },
    EstadoSupervisor: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeSchema.virtual("total").get(function () {
  let total = 0;
  this.cajas.forEach((element: Cajas) => (total += element.valor ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeModel =
  mongoose.models.Solicitudes ||
  mongoose.model("Solicitudes", SolicitudeSchema);

const BackupSchema = new mongoose.Schema<Backup>(
  {
    solicitude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudes",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupSchema.set("toJSON", {
  virtuals: true,
});

export const BackupModel =
  mongoose.models.Backups || mongoose.model("Backups", BackupSchema);

const AuditorySchema = new mongoose.Schema<Auditory>(
  {
    date: { type: String },
    user: { type: String },
    action: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AuditorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AuditorySchema.set("toJSON", {
  virtuals: true,
});

export const AuditoryModel =
  mongoose.models.Auditory || mongoose.model("Auditory", AuditorySchema);
