/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import Router from "next/router";
import Sidebar from "../lib/components/sidebar";
import { useAuth } from "../lib/hooks/use_auth";
import { toast } from "react-toastify";
import { CheckPermissions } from "../lib/utils/check_permissions";
import GeneralReportModal from "../lib/components/modals/generalReport";
import { useState } from "react";

export default function Home() {
  const { auth } = useAuth();
  const [modalVisibleGR, setModalVisibleGR] = useState<boolean>(false);

  const showModalGR = () => setModalVisibleGR(true);

  const handleSolicitudes = () => {
    auth.role === 1
      ? Router.push({ pathname: "/requestsSolicitude" })
      : Router.push({ pathname: "/solicitude" });
  };

  const handleHistory = () => {
    Router.push({ pathname: "/solicitudeHistory" });
  };

  const handleAppReportes = () => {
    Router.push({ pathname: "/reportes" });
  };

  const handleAppVentas = () => {
    Router.push({ pathname: "/ventas" });
  };

  const handleAppInventario = () => {
    Router.push({ pathname: "/inventario" });
  };
  return (
    <>
      <title>Tabacalera</title>
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
            <div
              className="mt-6 "
              style={{ display: "flex", alignItems: "center" }}
            >
              <p
                className="md:text-4xl text-xl text-center m-6"
                style={{
                  display: "inline-block",
                  color: "#610d9a",
                  padding: "12px",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                <strong>Sistema de Gestión Logística </strong> |{" "}
                <em
                  style={{
                    color: "#bb22dd",
                    fontStyle: "normal",
                    fontSize: "26px",
                  }}
                >
                  "Tabacalera J&Q S.A.S."
                </em>
                <hr
                  className="mt-0 ml-0 "
                  style={{
                    width: "100%",
                    height: "3px",
                    backgroundColor: "#fff",
                  }}
                />
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="max-w-sm p-6 bg-gray-100 border border-gray-200 rounded-lg shadow">
                <h2 className="text-center text-lg font-semibold">
                  Envio de contenedores
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-400 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                      Ver solicitudes
                    </button>
                  </div>
                  <div>
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-400 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                      Ver historial
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-w-sm p-6 bg-gray-100 border border-gray-200 rounded-lg shadow">
                <h2 className="text-center text-lg font-semibold">Reportes</h2>
                <div className="mt-4">
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-400 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                    Ver reportes de envios de contenedores
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeneralReportModal
        visible={modalVisibleGR}
        close={() => {
          setModalVisibleGR(null);
        }}
      />
    </>
  );
}
