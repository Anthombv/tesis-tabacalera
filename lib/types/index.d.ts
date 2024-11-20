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
  | 0 //Administrador
  | 1 //Bodeguero
  | 2 //Administrador de producto
  | 3 //Empacador
  | 4 //Secretaria
  | 5; //Gerente

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
  id?: string
  usuario: User
  mensaje: string
}

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
  cometarios: Array<Comentario>;
};

export type Solicitude = {
  id?: string;
  fecha: string;
  solicitante: User;
  cajas: Array<Cajas>;
  estadoEmpacador: Estados;
  EstadoAdministrador: Estados;
  EstadoBodeguero: Estados;
  EstadoMulling: Estados;
  EstadoSupervisor: Estados;
  ValorTotal: number;
};

//backups
export type Backup = {
  id?: string;
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
