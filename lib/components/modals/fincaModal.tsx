import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import { Fincas, ModalProps, ResponseData, Solicitude } from "../../types";
import { CheckFinished, CheckPermissions } from "../../utils/check_permissions";
import HttpClient from "../../utils/http_client";
import { UploadSolicitudeImages } from "../../utils/upload_solicitude_images";
import { Pendiente, Terminado } from "../../utils/constants";
import Router from "next/router";
import FormatedDate from "../../utils/formated_date";

const initialFincas: Fincas = {
  id: null,
  aposento: "",
  casona: "",
  corte: "",
  lote: "",
  variedad: "",
  cajas: [],
};

interface Props extends ModalProps<Fincas> {
  initialData?: Fincas;
}

const FincasModal = (props: Props) => {
  const { auth } = useAuth();
  const [solicitude, setSolicitude] = useState<Solicitude>({
    number: 0,
    solicitante: auth?.name,
    fecha: FormatedDate(),
    fincas: [],
    cometarios: [],
    informacionCurador: "",
    estadoCurador: Pendiente,
    estadoEmpacador: Pendiente,
    EstadoAdministrador: Pendiente,
    EstadoBodeguero: Pendiente,
    EstadoMulling: Pendiente,
    EstadoSupervisor: Pendiente,
  });
  const [initialValues, setInitialValues] = useState<Fincas>(initialFincas);
  const [image, setImage] = useState<File>(null);

  const handleClose = () => {
    formik.resetForm({ values: initialFincas });
    setImage(null);
    props.close();
  };

  const addCaja = () => {
    formik.setFieldValue("cajas", [
      ...formik.values.cajas,
      {
        id: null,
        NumeroDeCaja: 0,
        corte: "",
        lote: "",
        variedad: "",
        cantidad: 0,
        anioCosecha: 0,
        pesoBruto: 0,
        pesoNeto: 0,
        calidad: "",
        valor: 0,
        cometarios: [],
      },
    ]);
  };

  const removeCaja = (index: number) => {
    const updatedCajas = formik.values.cajas.filter((_, i) => i !== index);
    formik.setFieldValue("cajas", updatedCajas);
  };

  // maneja los datos y comportamiento del formulario
  const formik = useFormik<Fincas>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Fincas) => {
      //TODO: verificar la actualizacion de imagen
      await props.onDone({
        ...formData,
      });
      console.log(formData);
      handleClose();
    },
  });

  useEffect(() => {
    if (props.initialData) setInitialValues(props.initialData);
  }, [props.initialData]);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;

      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      setSolicitude(response.data);
      console.log(solicitude);
      console.log(solicitudeId);
    } else {
      setTimeout(loadData, 100);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 w-2/3 h-5/6 overflow-y-auto">
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{ color: "#94a3b8" }}
              className="text-center text-xl mb-2 font-semibold"
            >
              AGREGAR NUEVA CASONA
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Casona
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Casona"
                      name="casona"
                      value={formik.values?.casona ?? ""}
                      onChange={formik.handleChange}
                      disabled={!CheckPermissions(auth, [1])}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Aposento
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Aposento"
                      name="aposento"
                      value={formik.values?.aposento ?? ""}
                      onChange={formik.handleChange}
                      disabled={!CheckPermissions(auth, [1])}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Lote
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Lote"
                      name="lote"
                      value={formik.values?.lote ?? ""}
                      onChange={formik.handleChange}
                      disabled={!CheckPermissions(auth, [1])}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Corte
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Corte"
                      name="corte"
                      value={formik.values?.corte ?? ""}
                      onChange={formik.handleChange}
                      disabled={!CheckPermissions(auth, [1])}
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2, 3, 4, 5]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Variedad
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="text"
                      placeholder="Variedad"
                      name="variedad"
                      value={formik.values?.variedad ?? ""}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
            </div>

            <hr />

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-center text-xl mb-2 font-semibold">
                  Cajas
                </h3>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    CheckPermissions(auth, [0, 2, 4])
                      ? addCaja()
                      : toast.info("No tienes permiso para agregar cajas");
                  }}
                >
                  + Añadir Caja
                </button>
              </div>

              {formik.values.cajas.map((caja, index) => (
                <div
                  key={index}
                  className="border p-4 rounded mb-2 flex flex-col gap-4"
                >
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                      <label className="text-gray-700 text-sm font-bold mb-2">
                        Número de Caja
                      </label>
                      <input
                        type="text"
                        name={`cajas[${index}].NumeroDeCaja`}
                        value={caja.NumeroDeCaja ?? ""}
                        onChange={formik.handleChange}
                        disabled={!CheckPermissions(auth, [2, 4])}
                        className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      />
                    </div>
                    <div>
                      {CheckPermissions(auth, [4, 5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Año de coseña
                          </label>
                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="number"
                            placeholder="Año de coseña"
                            name={`cajas[${index}].anioCosecha`}
                            value={caja.anioCosecha ?? ""}
                            onChange={formik.handleChange}
                            disabled={!CheckPermissions(auth, [4])}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [4, 5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Variedad
                          </label>
                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="text"
                            placeholder="Variedad"
                            name={`cajas[${index}].variedad`}
                            value={caja.variedad ?? ""}
                            onChange={formik.handleChange}
                            disabled={!CheckPermissions(auth, [4])}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [4, 5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Corte
                          </label>
                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="text"
                            placeholder="Corte"
                            name={`cajas[${index}].corte`}
                            value={caja.corte}
                            onChange={formik.handleChange}
                            disabled={!CheckPermissions(auth, [4])}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [4, 5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Lote
                          </label>
                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="text"
                            placeholder="Lote"
                            name={`cajas[${index}].lote`}
                            value={caja.lote}
                            onChange={formik.handleChange}
                            disabled={!CheckPermissions(auth, [4])}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [4, 5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Calidad
                          </label>

                          <select
                            className="border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name={`cajas[${index}].calidad`}
                            value={caja.calidad ?? ""}
                            onChange={formik.handleChange}
                            disabled={!CheckPermissions(auth, [4])}
                          >
                            <option value="" selected disabled>
                              Seleccione una opcion
                            </option>
                            <option value="Bueno">Bueno</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Segunda">Segunda</option>
                          </select>
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Peso neto (libras)
                          </label>

                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="number"
                            placeholder="Peso neto"
                            name={`cajas[${index}].pesoNeto`}
                            value={caja.pesoNeto}
                            onChange={formik.handleChange}
                          />
                        </>
                      )}
                    </div>
                    <div>
                      {CheckPermissions(auth, [5]) && (
                        <>
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            * Peso bruto (libras)
                          </label>

                          <input
                            className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            type="number"
                            placeholder="Peso bruto"
                            name={`cajas[${index}].pesoBruto`}
                            value={caja.pesoBruto}
                            onChange={formik.handleChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2 self-end"
                    onClick={() => {
                      CheckPermissions(auth, [0, 2])
                        ? removeCaja(index)
                        : toast.info("No tienes permiso para eliminar cajas");
                    }}
                  >
                    Eliminar Caja
                  </button>
                </div>
              ))}
            </div>

            <hr />
            <div className="justify-end mt-3 grid md:grid-cols-4 grid-cols-1 gap-4">
              <div className="md:col-end-4">
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
                  type="submit"
                >
                  Guardar
                </button>
              </div>
              <div>
                <button
                  className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default FincasModal;
