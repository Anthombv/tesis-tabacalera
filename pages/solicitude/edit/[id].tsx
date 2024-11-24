import { useFormik } from "formik";
import { TabPanel } from "../../../lib/components/tab_container";
import SoliciterPanel from "../../../lib/layouts/edit_solicitude/soliciter";
import { Cajas, ResponseData, Solicitude } from "../../../lib/types";
import FormatedDate from "../../../lib/utils/formated_date";
import { useEffect, useState } from "react";
import { Pendiente } from "../../../lib/utils/constants";
import { useAuth } from "../../../lib/hooks/use_auth";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Sidebar from "../../../lib/components/sidebar";
import {
  CheckFinished,
  CheckPermissions,
} from "../../../lib/utils/check_permissions";
import { Table } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import CajasModal from "../../../lib/components/modals/cajasModal";
import EmpacadorPanel from "../../../lib/layouts/edit_solicitude/empacador";

export const EditSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [cajas, setCajas] = useState<Array<Cajas>>([]);
  const [initialValues, setInitialValues] = useState<Solicitude>({
    number: 0,
    solicitante: auth?.name,
    fecha: FormatedDate(),
    cajas: [],
    informacionCurador: "",
    estadoCurador: Pendiente,
    estadoEmpacador: Pendiente,
    EstadoAdministrador: Pendiente,
    EstadoBodeguero: Pendiente,
    EstadoMulling: Pendiente,
    EstadoSupervisor: Pendiente,
  });
  const [editingCajas, setEditingCajas] = useState<Cajas | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function getHighlightedText(text: string, highlight: string) {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="highlight">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  }
  const ITEMS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  let currentItems = cajas?.slice(indexOfFirstItem, indexOfLastItem);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setCajas(response.data.cajas);
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: Solicitude) => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const requestData = {
        ...formData,
        cajas: cajas,
        id: solicitudeId,
      };
      console.log(requestData);
      const response: ResponseData = await HttpClient(
        "/api/solicitude",
        "PUT",
        auth.userName,
        auth.role,
        requestData
      );
      if (response.success) {
        toast.success("Solicitud editada correctamente!");
        await loadData();
      } else {
        toast.warning(response.message);
      }
      setLoading(false);
    } else {
      setTimeout(onSubmit, 1000);
    }
  };

  const formik = useFormik<Solicitude>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit,
  });

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const showConfirmModal = (factureId: string) => setItemToDelete(factureId);
  const hideConfirmModal = () => setItemToDelete(null);

  const buttons = {
    edit: (rowData: Cajas) => {
      setEditingCajas(rowData);
      showModal();
    },
    delete: (rowData: Cajas) => {
      if (CheckPermissions(auth, [0, 1])) {
        showConfirmModal(rowData.id);
      }
    },
  };

  const tabPanels: Array<TabPanel> = [
    {
      name: "Solicitantes",
      content: (
        <SoliciterPanel sm={12} md={12} lg={6} xl={6} formik={formik} inTabs />
      ),
    },
    {
      name: "Empacador",
      content: (
        <EmpacadorPanel sm={12} md={12} lg={6} xl={6} formik={formik} inTabs />
      ),
    },
  ];

  const totalPages = Math.ceil(cajas?.length / ITEMS_PER_PAGE);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (e: any, pageNumber: number) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  //ordena la tabla por el nombre del proyecto
  const sortItemsByName = () => {
    const sortedItems = [...cajas].sort((a, b) =>
      a.corte.localeCompare(b.corte)
    );
    currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterItems = () => {
    if (searchTerm === "") {
      return currentItems;
    } else {
      return cajas.filter(
        (item) =>
          item.corte.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    }
  };

  return (
    <>
      <title>Editar solicitud</title>
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
                Editar solicitud de envio de contenedor
              </p>
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
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
                <div>
                  {CheckPermissions(auth, [1]) ? (
                    <SoliciterPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [2]) ? (
                    <EmpacadorPanel lg={6} md={6} formik={formik} />
                  ) : null}
                </div>
              </div>
              <div>
                <button
                  onClick={showModal}
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                >
                  Agregar caja
                </button>
                <button
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  onClick={() =>
                    !CheckFinished(
                      auth,
                      [1],
                      initialValues.estadoCurador,
                      "Aprobado"
                    )
                      ? formik.handleSubmit()
                      : toast.info(
                          "La solicitud ya fue aprobada, no tienes permiso para Actualizar"
                        )
                  }
                >
                  Actualizar
                </button>
              </div>
              {CheckPermissions(auth, [0, 2, 3, 4, 5, 6]) && (
                <>
                  <div className="container px-80">
                    <div className="text-center mx-auto block col-md-6 col-lg-3 mb-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                        </div>
                        <input
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          value={searchTerm}
                          onChange={handleChange}
                          placeholder="Filtro de Busqueda"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative overflow-x-auto p-3">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="text-center p-0 align-middle">
                          <th>Acciones</th>
                          {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
                            <th className="px-6 py-3">Numero de caja</th>
                          )}
                          {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
                            <th className="px-6 py-3">Corte</th>
                          )}
                          {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
                            <th className="px-6 py-3">Lote</th>
                          )}
                          {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
                            <th className="px-6 py-3">Variedad</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <>
                          {sortItemsByName()}
                          {(filterItems() ?? []).map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className="text-center text-nowrap"
                              >
                                <td className="p-1">
                                  <div className="d-flex justify-content-between">
                                    <button
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                      style={{
                                        marginRight: "2px",
                                        width: "25px",
                                        height: "25px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      onClick={() => buttons.edit(item)}
                                    >
                                      <span
                                        style={{
                                          height: "100%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <FaEdit />
                                      </span>
                                    </button>
                                  </div>
                                </td>
                                {CheckPermissions(
                                  auth,
                                  [0, 1, 2, 3, 4, 5, 6, 8]
                                ) && <td>{item.NumeroDeCaja}</td>}
                                {CheckPermissions(
                                  auth,
                                  [0, 1, 2, 3, 4, 5, 6, 8]
                                ) && <td>{item.corte}</td>}
                                {CheckPermissions(
                                  auth,
                                  [0, 1, 2, 3, 4, 5, 6, 8]
                                ) && <td>{item.lote}</td>}
                                {CheckPermissions(
                                  auth,
                                  [0, 1, 2, 3, 4, 5, 6, 8]
                                ) && <td>{item.variedad}</td>}
                              </tr>
                            );
                          })}
                        </>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
          } else {
            setCajas((oldData) =>
              oldData.map((element: Cajas) =>
                element.id === newItem.id ? newItem : element
              )
            );
            setEditingCajas(null);
          }
        }}
      />
    </>
  );
};

export default EditSolicitude;
