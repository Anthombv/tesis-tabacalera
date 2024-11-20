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
