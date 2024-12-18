import { Button } from "react-bootstrap";
import Sidebar from "../../lib/components/sidebar";
import { CheckPermissions } from "../../lib/utils/check_permissions";
import Router from "next/router";
import { toast } from "react-toastify";
import LoadingContainer from "../../lib/components/loading_container";
import TreeTable, { ColumnData } from "../../lib/components/tree_table";
import { useAuth } from "../../lib/hooks/use_auth";
import { useEffect, useState } from "react";
import { Cajas, Fincas, Solicitude } from "../../lib/types";
import HttpClient from "../../lib/utils/http_client";
import { StateField } from "../../lib/styles/views/indexStyled";
import { Pendiente } from "../../lib/utils/constants";

type Props = {
  dates: Array<string>;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

export const SolicitudePage = (props: Props) => {
  const { auth } = useAuth();
  const [tableData, setTableData] = useState<Array<Solicitude>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);

    var response = await HttpClient(
      "/api/solicitude",
      "GET",
      auth.userName,
      auth.role
    );

    const solicitudes: Array<Solicitude> = response.data ?? [];
    console.log();
    setTableData(solicitudes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dates]);

  const columns: ColumnData[] = [
    {
      dataField: "number",
      caption: "#",
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "fecha",
      caption: "Fecha de Registro",
      cssClass: "bold",
    },
    {
      dataField: "solicitante",
      caption: "Solicitante",
      cssClass: "bold",
    },
    
    {
      dataField: "estadoCurador",
      caption: "Curador",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "estadoEmpacador",
      caption: "Empacador",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "EstadoAdministrador",
      caption: "Administrador",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "EstadoBodeguero",
      caption: "Bodeguero",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
    {
      dataField: "EstadoMulling",
      caption: "Mulling",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    edit: (rowData: Cajas) =>
      !CheckPermissions(auth, [0])
        ? Router.push({
            pathname: "/solicitude/edit/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
    //delete: async (rowData: Cajas) => {
    //  CheckPermissions(auth, [0])
    //    ? showConfirmModal(rowData.id)
    //    : toast.error("No puedes eliminar una Solicitud");
    //},
    download: (rowData: Cajas) =>
      !CheckPermissions(auth, [0])
        ? Router.push({
            pathname: "/solicitude/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };
  return (
    <>
      <title>Envio de contenedor</title>
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
            <div className="mt-6">
              <p className="md:text-4xl text-xl text-center pt-5 font-extrabold text-yellow-500">
                Solicitudes de envio de contenedor
              </p>
            </div>

            <Button
              className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
              onClick={() =>
                CheckPermissions(auth, [0, 1])
                  ? Router.push({ pathname: "/solicitude/create" })
                  : toast.info("No puede ingresar solicitudes")
              }
            >
              Crear Solicitud
            </Button>
            <div className="p-2">
              <TreeTable
                keyExpr="id"
                dataSource={tableData}
                columns={columns}
                searchPanel={true}
                buttons={buttons}
                colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
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
    </>
  );
};

export default SolicitudePage;
