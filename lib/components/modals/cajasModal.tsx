import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use_auth";
import { Cajas, ModalProps, ResponseData } from "../../types";
import { CheckPermissions } from "../../utils/check_permissions";
import HttpClient from "../../utils/http_client";
import { UploadSolicitudeImages } from "../../utils/upload_solicitude_images";

const initialCajas: Cajas = {
  id: null,
  NumeroDeCaja: 0,
  corte: "",
  lote: "",
  variedad: "",
  cantidad: 0,
  anioCosecha: 0,
  pesoNeto: 0,
  pesoBruto: 0,
  calidad: "",
  valor: 0,
  cometarios: [],
};

interface Props extends ModalProps<Cajas> {
  initialData?: Cajas;
}

const CajasModal = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] = useState<Cajas>(initialCajas);
  const [image, setImage] = useState<File>(null);

  const handleClose = () => {
    formik.resetForm({ values: initialCajas });
    setImage(null);
    props.close();
  };

  // maneja los datos y comportamiento del formulario
  const formik = useFormik<Cajas>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Cajas) => {
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
              AGREGAR NUEVA CAJA
            </div>
            <hr />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-3">
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
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
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
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
                    />
                  </>
                )}
              </div>
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
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

            <div>
              <div>
                {CheckPermissions(auth, [0, 1, 2]) && (
                  <>
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      * Numero de caja
                    </label>
                    <input
                      className="noscroll appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      type="number"
                      placeholder="Numero de caja"
                      name="NumeroDeCaja"
                      value={formik.values?.NumeroDeCaja ?? 0}
                      onChange={formik.handleChange}
                    />
                  </>
                )}
              </div>
            </div>
            <hr />
            <div className="justify-end mt-3 grid md:grid-cols-4 grid-cols-1 gap-4">
              <div className="md:col-end-4">
                <button
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
                  type="submit"
                >
                  Guardar caja
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
export default CajasModal;
