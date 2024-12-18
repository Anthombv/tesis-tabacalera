import mongoose, { mongo, Schema } from "mongoose";
import {
  Auditory,
<<<<<<< HEAD
=======
  Backup,
  Cajas,
  Comentario,
  Fincas,
  Solicitude,
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
  User,
} from "../types";

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
<<<<<<< HEAD
=======
    estado: { type: String },
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
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

<<<<<<< HEAD
=======
const ComentarioSchema = new mongoose.Schema<Comentario>(
  {
    //Solicitante
    usuario: { type: String },
    mensaje: { type: String },
    fecha: { type: String },
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

    cantidad: { type: Number },
    anioCosecha: { type: Number },
    pesoBruto: { type: Number },
    pesoNeto: { type: Number },
    corte: { type: String },
    lote: { type: String },
    variedad: { type: String },
    valor: { type: Number },
    calidad: { type: String },
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

const FincasSchema = new mongoose.Schema<Fincas>(
  {
    //Solicitante
    casona: { type: String },
    aposento: { type: String },
    corte: { type: String },
    lote: { type: String },
    variedad: { type: String },
    cajas: { type: [CajasSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FincasSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FincasSchema.set("toJSON", {
  virtuals: true,
});

const SolicitudeSchema = new mongoose.Schema<Solicitude>(
  {
    number: { type: Number },
    fecha: { type: String },
    solicitante: { type: String },
    informacionCurador: { type: String },
    fincas: { type: [FincasSchema] },
    cometarios: { type: [ComentarioSchema] },
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
  this.fincas[0].cajas.forEach(
    (element: Cajas) => (total += element.valor ?? 0)
  );
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

>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
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
