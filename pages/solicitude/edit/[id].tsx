import { useFormik } from "formik";
import SoliciterPanel from "../../../lib/layouts/edit_solicitude/soliciter";
import {
  Cajas,
  Comentario,
  Fincas,
  ResponseData,
  Solicitude,
} from "../../../lib/types";
import FormatedDate from "../../../lib/utils/formated_date";
import { useEffect, useState } from "react";
import { Pendiente, Terminado } from "../../../lib/utils/constants";
import { useAuth } from "../../../lib/hooks/use_auth";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { toast } from "react-toastify";
import Sidebar from "../../../lib/components/sidebar";
import {
  CheckFinished,
  CheckFinishedToMore,
  CheckPermissions,
} from "../../../lib/utils/check_permissions";
import { Button, Col, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import EmpacadorPanel from "../../../lib/layouts/edit_solicitude/empacador";
import FincasModal from "../../../lib/components/modals/fincaModal";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import ComentModal from "../../../lib/components/modals/coment";
import AdminPanel from "../../../lib/layouts/edit_solicitude/administrador";
import BodegueroPanel from "../../../lib/layouts/edit_solicitude/bodeguero";
import MullingPanel from "../../../lib/layouts/edit_solicitude/mulling";
import SupervisorPanel from "../../../lib/layouts/edit_solicitude/supervisor";

export const EditSolicitude = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsComment, setItemsComment] = useState<Array<Comentario>>([]);
  const [fincas, setFincas] = useState<Array<Fincas>>([]);
  const [initialValues, setInitialValues] = useState<Solicitude>({
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
  const [editingCajas, setEditingCajas] = useState<Cajas | null>(null);
  const [editingFincas, setEditingFincas] = useState<Fincas | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [itemCommentToDelete, setItemCommentToDelete] = useState<string>(null);
  const [editingComment, setEditingComment] = useState<Comentario | null>(null);

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
  let currentItems = fincas?.slice(indexOfFirstItem, indexOfLastItem);

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
      setFincas(response.data.fincas);
      setItemsComment(response.data.cometarios);
      console.log(fincas, initialValues);
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
        fincas: fincas,
        id: solicitudeId,
        cometarios: itemsComment,
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

  const showModalComment = () => setCommentModalVisible(true);

  const showConfirmModalComment = (commentId: string) =>
    setItemCommentToDelete(commentId);
  const hideConfirmModalComment = () => setItemCommentToDelete(null);

  const buttons = {
    edit: (rowData: Fincas) => {
      setEditingFincas(rowData);
      showModal();
    },
    delete: (rowData: Fincas) => {
      if (CheckPermissions(auth, [0, 1])) {
        showConfirmModal(rowData.id);
      }
    },
  };

  const totalPages = Math.ceil(fincas?.length / ITEMS_PER_PAGE);
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
    const sortedItems = [...fincas].sort((a, b) =>
      a.aposento.localeCompare(b.aposento)
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
      return fincas.filter(
        (item) =>
          item.aposento.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
    }
  };

  const columnsComent: ColumnData[] = [
    {
      dataField: "usuario",
      caption: "Nombre",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "fecha",
      caption: "Fecha",
      width: 200,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "mensaje",
      caption: "Comentario",
      alignment: "left",
      cssClass: "bold",
    },
  ];

  const buttonsComment = {
    edit: (rowData: Comentario) => {
      setEditingComment(rowData);
      CheckPermissions(auth, [0])
        ? showModalComment()
        : toast.info("No puedes editar un comentario");
    },
    delete: async (rowData: Comentario) => {
      CheckPermissions(auth, [0])
        ? showConfirmModalComment(rowData.id)
        : toast.info("No puedes borrar un comentario");
    },
  };

  return (
    <>
      <title>Editar solicitud</title>
      <div className="flex h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div
          className="w-12/12 md:w-5/6"
          style={{
            background: "#EED77B",
          }}
        >
          <div className="bg-white w-5/6 h-auto mx-auto">
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
                    disabled
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  {CheckPermissions(auth, [1]) ? (
                    <SoliciterPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [2]) ? (
                    <EmpacadorPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [3]) ? (
                    <AdminPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [4]) ? (
                    <BodegueroPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [5]) ? (
                    <MullingPanel lg={6} md={6} formik={formik} />
                  ) : CheckPermissions(auth, [6]) ? (
                    <SupervisorPanel lg={6} md={6} formik={formik} />
                  ) : null}
                </div>
              </div>
              <div>
                {CheckPermissions(auth, [0, 1]) && (
                  <button
                    onClick={showModal}
                    className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                    disabled={CheckFinished(
                      auth,
                      [1],
                      initialValues.estadoCurador,
                      Terminado
                    )}
                  >
                    Agregar casona
                  </button>
                )}
                <button
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  onClick={() => formik.handleSubmit()}
                  disabled={CheckFinishedToMore(
                    auth,
                    [1, 2, 3],
                    {
                      1: initialValues.estadoCurador,
                      2: initialValues.estadoEmpacador,
                      3: initialValues.EstadoAdministrador,
                    },
                    Terminado
                  )}
                >
                  Actualizar
                </button>
              </div>
              {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
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
                            <th className="px-6 py-3">Casona</th>
                          )}
                          {CheckPermissions(auth, [0, 1, 2, 3, 4, 5, 6]) && (
                            <th className="px-6 py-3">Aposento</th>
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
                        {(filterItems() ?? []).map((item, index) => {
                          return (
                            <tr key={index} className="text-center text-nowrap">
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
                              ) && <td>{item.casona}</td>}

                              {CheckPermissions(
                                auth,
                                [0, 1, 2, 3, 4, 5, 6, 8]
                              ) && <td>{item.aposento}</td>}
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
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div
              style={{
                marginTop: "3%",
                margin: "2%",
                padding: "2em",
              }}
            >
              <h3 className="mt-2 text-center text-lg font-semibold">
                Registro de Comentarios
              </h3>
              <div className="w-75 m-3">
                <Button
                  className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                  onClick={() => setCommentModalVisible(true)}
                  disabled={CheckFinishedToMore(
                    auth,
                    [1, 2, 3],
                    {
                      1: initialValues.estadoCurador,
                      2: initialValues.estadoEmpacador,
                      3: initialValues.EstadoAdministrador,
                    },
                    Terminado
                  )}
                >
                  Agregar Comentario
                </Button>
              </div>
              <div className="m-3">
                <TreeTable
                  keyExpr="id"
                  dataSource={itemsComment}
                  columns={columnsComent}
                  buttons={buttonsComment}
                  searchPanel={false}
                  colors={{
                    headerBackground: "#9ed9f7",
                    headerColor: "black",
                    contentBackground: "#c6e5f5",
                    contentColor: "black",
                  }}
                  paging
                  buttonsFirst
                  showNavigationButtons
                  showNavigationInfo
                  pageSize={15}
                  infoText={(actual, total, items) =>
                    `Página ${actual} de ${total} (${items} comentarios)`
                  }
                />
              </div>
              <Row className="w-75 m-2">
                <Col className="mb-3" lg={3}>
                  <Button
                    className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                    onClick={() => formik.handleSubmit()}
                    disabled={CheckFinishedToMore(
                      auth,
                      [1, 2, 3],
                      {
                        1: initialValues.estadoCurador,
                        2: initialValues.estadoEmpacador,
                        3: initialValues.EstadoAdministrador,
                      },
                      Terminado
                    )}
                  >
                    Crear Comentario
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
                    onClick={() => Router.back()}
                  >
                    Volver
                  </Button>
                </Col>
              </Row>
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
          } else {
            setFincas((oldData) =>
              oldData.map((element: Fincas) =>
                element.id === newItem.id ? newItem : element
              )
            );
            setEditingFincas(null);
          }
        }}
      />

      <ComentModal
        visible={commentModalVisible}
        close={() => setCommentModalVisible(!commentModalVisible)}
        initialData={editingComment}
        onDone={(newItemComment: Comentario) => {
          if (editingComment === null) {
            setItemsComment((oldData) => [
              ...oldData,
              { ...newItemComment, id: `${oldData.length + 1}` },
            ]);
          } else {
            setItemsComment((oldData) =>
              oldData.map((element: Comentario) =>
                element.id === newItemComment.id ? newItemComment : element
              )
            );
            setEditingComment(null);
          }
        }}
      />
    </>
  );
};

export default EditSolicitude;
