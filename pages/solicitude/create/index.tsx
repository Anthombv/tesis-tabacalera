import { Button, Form } from "react-bootstrap";
import Sidebar from "../../../lib/components/sidebar";
import { useAuth } from "../../../lib/hooks/use_auth";
import { useFormik } from "formik";
import Router from "next/router";
import { toast } from "react-toastify";
import { Solicitude, ResponseData, Cajas } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import { useState } from "react";
import FormatedDate from "../../../lib/utils/formated_date";
import { Pendiente } from "../../../lib/utils/constants";
import CajasModal from "../../../lib/components/modals/cajasModal";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";

export const SolicitudeCreate = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [cajas, setCajas] = useState<Array<Cajas>>([]);
  const [initialValues, _setInitialValues] = useState<Solicitude>({
    number: 0,
    solicitante: auth?.name,
    fecha: FormatedDate(),
    informacionCurador: "",
    cajas: [],
    estadoCurador: Pendiente,
    estadoEmpacador: Pendiente,
    EstadoAdministrador: Pendiente,
    EstadoBodeguero: Pendiente,
    EstadoMulling: Pendiente,
    EstadoSupervisor: Pendiente,
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCajas, setEditingCajas] = useState<Cajas | null>(null);

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Solicitude) => {
      console.log(formData);
      setLoading(true);
      console.log(cajas);

      const payload = {
        ...formData,
        cajas: cajas,
      };
      console.log(payload);
      const response: ResponseData = await HttpClient(
        "/api/solicitude",
        "POST",
        auth.userName,
        auth.role,
        payload
      );
      if (response.success) {
        toast.success("Solicitud creada correctamente!");
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
      Router.back();
    },
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const columns: ColumnData[] = [
    {
      dataField: "casona",
      caption: "Casona",
      cssClass: "bold",
    },
    {
      dataField: "aposento",
      caption: "Aposento",
      cssClass: "bold",
    },
    {
      dataField: "corte",
      caption: "Corte",
      cssClass: "bold",
    },
    {
      dataField: "lote",
      caption: "Lote",
      cssClass: "bold",
    },
    {
      dataField: "variedad",
      caption: "Variedad",
      cssClass: "bold",
    },
  ];

  return (
    <>
      <title>Crear solicitud</title>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div
          className="w-12/12 md:w-5/6"
          style={{
            background: "#EED77B",
          }}
        >
          <div className="bg-white w-5/6 h-5/6 mx-auto">
            <div className="mt-10">
              <p className="md:text-4xl text-xl text-center pt-5 font-extrabold text-yellow-500">
                Crear solicitud de envio de contenedor
              </p>
              <div className="grid grid-cols-3 gap-4 px-4 py-2">
                <div>
                  <label>Solicitante</label>
                  <input
                    type="text"
                    placeholder="Solicitante"
                    value={formik.values.solicitante}
                    disabled
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Fecha</label>
                  <input
                    type="text"
                    placeholder="fecha"
                    value={formik.values.fecha}
                    disabled
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
                <div>
                  <label>Informacion</label>
                  <textarea
                    name="informacionCurador"
                    placeholder="Ingresa la informacion del tabaco"
                    value={formik.values.informacionCurador}
                    onChange={formik.handleChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Button
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  onClick={() => formik.handleSubmit()}
                >
                  Guardar Solicitud
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CajasModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingCajas}
        onDone={(newItem: Cajas) => {
          if (editingCajas === null) {
            setCajas((oldData) => [
              ...oldData,
              { ...newItem, id: `${oldData.length + 1}` },
            ]);
            console.log(cajas);
            console.log(newItem);
          } else {
            setCajas((oldData) =>
              oldData.map((element: Cajas) =>
                element.id === newItem.id ? newItem : element
              )
            );
            console.log(cajas);
            setEditingCajas(null);
          }
        }}
      />
    </>
  );
};

export default SolicitudeCreate;
