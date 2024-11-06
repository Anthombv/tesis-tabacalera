/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "react-bootstrap";
import { useAuth } from "../../hooks/use_auth";
import theme from "../../styles/theme";
import { LoginData } from "../../types";
import HttpClient from "../../utils/http_client";
import { toast } from "react-toastify";
import LoadingContainer from "../../components/loading_container";

const currentYear = new Date().getFullYear();
// login de la app
const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // llama la funcion para iniciar sesion
  const { login } = useAuth();

  // valores del formulario
  const [initialValues, _setInitialValues] = useState<LoginData>({
    userName: "",
    password: "",
  });

  // envia los datos del formulario
  const onSubmit = async (formData: LoginData) => {
    setLoading(true);
    const response = await HttpClient("/api/login", "POST", "", -1, formData);
    if (response.success) {
      const data = response.data;
      login(data);
      console.log(formData);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // maneja los datos y comportamiento del formulario
  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <title>Inicio de sesión</title>
      <section
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          background: "#EED77B",
        }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-3xl shadow-lg bg-white"
          style={{
            width: 600, // Ajuste de ancho más compacto
            padding: "20px",
          }}
        >
          <h2
            className="text-center"
            style={{
              color: "#B98F35",
              padding: "12px",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            Gestión de envío de contenedores Tabacalera J&Q S.A.S
          </h2>

          <LoadingContainer visible={loading} miniVersion>
            <form onSubmit={formik.handleSubmit} className="w-full p-5">
              <div className="mb-4">
                <label className="block">Nombre de Usuario</label>
                <input
                  type="text"
                  name="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  placeholder="Ingrese su usuario"
                  className="form-control h-10 bg-gray-100 w-full rounded pl-2"
                />
              </div>
              <div className="mb-6">
                <label className="block">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Ingrese su contraseña"
                  className="form-control h-10 bg-gray-100 w-full rounded pl-2"
                />
              </div>

              <button
                className="bg-yellow-200 hover:bg-yellow-400 text-white w-full py-2 px-4 rounded font-semibold"
                type="submit"
              >
                Iniciar Sesión
              </button>
              <footer className="mt-8 pt-6 text-center">
                <p
                  style={{
                    color: "#000",
                    fontSize: "11px",
                  }}
                >
                  <strong>© Desarrollado</strong> por Rocio 2024-
                  <strong>2025</strong>
                </p>
              </footer>
            </form>
          </LoadingContainer>
        </div>
      </section>
    </>
  );
};

export default Login;
