import { Button, Form } from "react-bootstrap";
import Sidebar from "../../../lib/components/sidebar";
import { useAuth } from "../../../lib/hooks/use_auth";
import { useFormik } from "formik";
import Router from "next/router";
import { toast } from "react-toastify";
import { Solicitude, ResponseData, Cajas, Fincas } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import { UploadSolicitudeImages } from "../../../lib/utils/upload_solicitude_images";
import { useState } from "react";
import FormatedDate from "../../../lib/utils/formated_date";
import { Pendiente, Terminado } from "../../../lib/utils/constants";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import FincasModal from "../../../lib/components/modals/fincaModal";
import ConfirmModal from "../../../lib/components/modals/confirm";
import { CheckFinished } from "../../../lib/utils/check_permissions";

export const SolicitudeCreate = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [fincas, setFincas] = useState<Array<Fincas>>([]);
  const [initialValues, _setInitialValues] = useState<Solicitude>({
    number: 0,
    solicitante: auth?.name,
    fecha: FormatedDate(),
    informacionCurador: "",
    fincas: [],
    cometarios: [],
    estadoCurador: Pendiente,
    estadoEmpacador: Pendiente,
    EstadoAdministrador: Pendiente,
    EstadoBodeguero: Pendiente,
    EstadoMulling: Pendiente,
    EstadoSupervisor: Pendiente,
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingFincas, setEditingFincas] = useState<Fincas | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>(null);

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Solicitude) => {
      console.log(formData);
      setLoading(true);
      console.log(fincas);

      const payload = {
        ...formData,
        fincas: fincas,
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

  const showConfirmModal = (fincaId: string) => setItemToDelete(fincaId);
  const hideConfirmModal = () => setItemToDelete(null);

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
      dataField: "lote",
      caption: "Lote",
      cssClass: "bold",
    },
    {
      dataField: "corte",
      caption: "Corte",
      cssClass: "bold",
    },
    {
      dataField: "variedad",
      caption: "Variedad",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Fincas) => {
      setEditingFincas(rowData);
      showModal();
    },
    delete: (rowData: Fincas) => showConfirmModal(rowData.id),
  };

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
                <button
                  onClick={showModal}
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  disabled={CheckFinished(
                    auth,
                    [1],
                    formik.values?.estadoCurador,
                    Terminado
                  )}
                >
                  Agregar casona
                </button>
                <Button
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  onClick={() => formik.handleSubmit()}
                >
                  Guardar Solicitud
                </Button>
              </div>
              <div className="p-2">
                <TreeTable
                  keyExpr="id"
                  dataSource={fincas}
                  columns={columns}
                  searchPanel={true}
                  buttons={buttons}
                  colors={{
                    headerBackground: "#F8F9F9",
                    headerColor: "#CD5C5C",
                  }}
                  buttonsFirst
                  paging
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={15}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} solicitudes)`
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FincasModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingFincas}
        onDone={(newItem: Fincas) => {
          if (editingFincas === null) {
            setFincas((oldData) => [
              ...oldData,
              { ...newItem, id: `${oldData.length + 1}` },
            ]);
            console.log(fincas);
            console.log(newItem);
          } else {
            setFincas((oldData) =>
              oldData.map((element: Fincas) =>
                element.id === newItem.id ? newItem : element
              )
            );
            console.log(fincas);
            setEditingFincas(null);
          }
        }}
      />

      <ConfirmModal
        visible={itemToDelete !== null}
        close={() => setItemToDelete(null)}
        onDone={() => {
          setFincas((oldData) => [
            ...oldData.filter((item: Fincas) => item.id !== itemToDelete),
          ]);
          hideConfirmModal();
        }}
      />
    </>
  );
};

export default SolicitudeCreate;
