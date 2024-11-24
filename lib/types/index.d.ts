import { FormikProps, FormikErrors, FormikTouched } from "formik";

//tipos de datos para la app
export type AuthContextProps = {
  auth: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

//Datos de respuesta
export type ResponseData = {
  message?: string;
  data?: any;
  success: boolean;
};

//Datos del login
export type LoginData = {
  userName: string;
  password: string;
};

//Roles del sistema
export type UserRole =
  | 0 //AdministradorSistema
  | 1 //Curador
  | 2 //Empacador
  | 3 //Administrador
  | 4 //Bodeguero
  | 5 //Mulling
  | 6 //Supervisor
  | 7 //Secretaria
  | 8; //Gerente

//Datos de los usuarios
export type User = {
  id?: string;
  userName: string;
  password?: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  identificationCard: string;
  dateBirth: string;
  age: number;
};

export type Estados = En_proceso | Pendiente | Terminado | Rechazado;

export type Comentario = {
  id?: string;
  usuario: User;
  mensaje: string;
};

export type Cajas = {
  id?: string;
  NumeroDeCaja: number;
  corte: string;
  lote: string;
  variedad: string;
  cantidad: number;
  anioCosecha: number;
  pesoBruto: number;
  pesoNeto: number;
  calidad: string;
  valor: number;
  casona: string;
  aposento: string;
  cometarios: Array<Comentario>;
};

export type Solicitude = {
  id?: string;
  number: number;
  fecha: string;
  informacionCurador: string;
  solicitante: string;
  cajas: Array<Cajas>;
  estadoCurador: string;
  estadoEmpacador: string;
  EstadoAdministrador: string;
  EstadoBodeguero: string;
  EstadoMulling: string;
  EstadoSupervisor: string;
};

//backups
export type Backup = {
  id?: string;
  solicitude: any | Solicitude;
};

//Auditoria del sistema
export type Auditory = {
  id?: string;
  date: string;
  user: string;
  action: string;
};

export interface ModalProps<T> {
  visible: boolean;
  close: () => void;
  onDone?: (data?: T) => void | Promise<void>;
}

export interface FormikComponentProps<T = Element> extends FormikProps<T> {
  formik: {
    values: T;
    handleChange: {
      (e: ChangeEvent<any>): void;
      <T_1 = string | ChangeEvent<T>>(field: T_1): T_1 extends ChangeEvent<T>
        ? void
        : (e: string | ChangeEvent<T>) => void;
    };
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
    setFieldValue: (
      field: string,
      value: T,
      shouldValidate?: boolean
    ) => Promise<void> | Promise<FormikErrors<T>>;
    setFieldError: (field: string, value: string) => void;
  };
}
