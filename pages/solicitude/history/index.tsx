import { Button } from "react-bootstrap";
import Router from "next/router";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ConfirmModal from "../../../lib/components/modals/confirm";
import Sidebar from "../../../lib/components/sidebar";
import TreeTable, { ColumnData } from "../../../lib/components/tree_table";
import { useAuth } from "../../../lib/hooks/use_auth";
import { StateField } from "../../../lib/styles/views/indexStyled";
import { Solicitude, Cajas } from "../../../lib/types";
import { CheckPermissions } from "../../../lib/utils/check_permissions";
import { Pendiente } from "../../../lib/utils/constants";
import HttpClient from "../../../lib/utils/http_client";

type Props = {
  dates: Array<string>;
};

export const SolicitudePage = (props: Props) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Solicitude>>([]);
  const [page, setPage] = useState(2);

  const loadData = async () => {
    setLoading(true);

    const response = await HttpClient(
      "/api/solicitude/history?page=1",
      "GET",
      auth.userName,
      auth.role
    );

    const solicitudes: Array<Solicitude> = response.data ?? [];
    setTableData(solicitudes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    {
      dataField: "EstadoSupervisor",
      caption: "Supervisor",
      cellRender: (params) => <StateField state={params.value ?? Pendiente} />,
      width: 80,
      alignment: "center",
      cssClass: "bold",
    },
  ];

  const buttons = {
    download: (rowData: Cajas) =>
      !CheckPermissions(auth, [0])
        ? Router.push({
            pathname: "/solicitude/print/" + (rowData.id as string),
          })
        : toast.error("No puedes acceder"),
  };
  return (
    <>
      <title>Historial</title>
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
                Historial de contenedores enviados
              </p>
            </div>
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
                pageSize={10}
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
