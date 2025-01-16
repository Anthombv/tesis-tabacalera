/* eslint-disable @next/next/no-img-element */
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Cajas, ResponseData, Solicitude } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import Image from "next/image";

const PrintSolicitude = () => {
  const { auth } = useAuth();
  const [solicitude, setSolicitude] = useState<Solicitude>(null);

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      const solicitudeId = Router.query.id as string;
      console.log(solicitudeId);
      const response: ResponseData = await HttpClient(
        "/api/solicitude/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      console.log(response);
      setSolicitude(response.data);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cajasPorCorte = useMemo(() => {
    if (!solicitude?.fincas) return {};

    const todasLasCajas = solicitude.fincas.flatMap((finca) => finca.cajas);

    return todasLasCajas.reduce<Record<string, number>>((acc, caja) => {
      if (!caja.corte) return acc;
      acc[caja.corte] = (acc[caja.corte] || 0) + 1;
      return acc;
    }, {});
  }, [solicitude]);

  const cortesOrdenados = useMemo(() => {
    return Object.entries(cajasPorCorte) as [string, number][];
  }, [cajasPorCorte]);

  const totalCajas = useMemo(() => {
    return cortesOrdenados.reduce((sum, [_, cantidad]) => sum + cantidad, 0);
  }, [cortesOrdenados]);

  // Cálculo de peso neto y bruto en libras y kilos
  const totalPesoNetoLibras = useMemo(() => {
    if (!solicitude?.fincas) return 0;

    const todasLasCajas = solicitude.fincas.flatMap((finca) => finca.cajas);

    return todasLasCajas.reduce((acc, caja) => {
      if (caja.pesoNeto) {
        return acc + caja.pesoNeto;
      }
      return acc;
    }, 0);
  }, [solicitude]);

  const totalPesoBrutoLibras = useMemo(() => {
    if (!solicitude?.fincas) return 0;

    const todasLasCajas = solicitude.fincas.flatMap((finca) => finca.cajas);

    return todasLasCajas.reduce((acc, caja) => {
      if (caja.pesoBruto) {
        return acc + caja.pesoBruto;
      }
      return acc;
    }, 0);
  }, [solicitude]);

  // Convertir libras a kilos
  const librasToKilos = (libras: number) => libras * 0.453592;

  const totalPesoNetoKilos = useMemo(
    () => librasToKilos(totalPesoNetoLibras),
    [totalPesoNetoLibras]
  );
  const totalPesoBrutoKilos = useMemo(
    () => librasToKilos(totalPesoBrutoLibras),
    [totalPesoBrutoLibras]
  );

  const cajasPorCortes = useMemo(() => {
    if (!solicitude?.fincas) return {};

    const todasLasCajas = solicitude.fincas.flatMap((finca) => finca.cajas);

    // Agrupar cajas por corte
    return todasLasCajas.reduce<Record<string, Cajas[]>>((acc, caja) => {
      if (!caja.NumeroDeCaja) return acc;

      if (!acc[caja.NumeroDeCaja]) {
        acc[caja.NumeroDeCaja] = [];
      }
      acc[caja.NumeroDeCaja].push(caja);
      return acc;
    }, {});
  }, [solicitude]);
  return (
    <>
      {solicitude === null ? (
        <div>Error al cargar los datos</div>
      ) : (
        <div>
          <style>
            {`
                  @media print {
                    .clase-a-ocultar {
                      display: none !important;
                    }
                  }
                `}
          </style>
          <div className="grid grid-cols-2 clase-a-ocultar">
            <div className="col">
              <button
                className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-yellow-900"
                onClick={() => window.print()}
              >
                Imprimir
              </button>
            </div>
            <div className="col">
              <button
                className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-3 text-center mx-2 mb-2 mt-3 dark:focus:ring-red-900"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>
          </div>
          <div
            style={{
              width: "297mm",
              height: "210mm",
              position: "relative",
              margin: "0 auto",
              marginBottom: "5%",
            }}
          >
            <div className="grid grid-cols-2 text-center">
              <h1 className="flex justify-center items-center text-xl font-bold">
                {solicitude.informacionCurador}
              </h1>
              <img
                src="/logoempresa.jpeg"
                alt="Picture of the author"
                className="w-auto h-20 mx-auto block"
              />
            </div>
            <div className="w-full max-w-4xl mx-auto mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y">
                  {cortesOrdenados
                    .slice(0, Math.ceil(cortesOrdenados.length / 2))
                    .map(([corte, cantidad]) => (
                      <div key={corte} className="flex">
                        <p className="text-gray-700 mr-2">
                          Cajas Corte {corte}:
                        </p>
                        <span className="font-semibold">
                          {cantidad} {cantidad === 1 ? "Caja" : " Cajas"}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="space-y">
                  {cortesOrdenados
                    .slice(Math.ceil(cortesOrdenados.length / 2))
                    .map(([corte, cantidad]) => (
                      <div key={corte} className="flex">
                        <p className="text-gray-700 mr-2">
                          Cajas Corte {corte}:
                        </p>
                        <span className="font-semibold">
                          {cantidad} {cantidad === 1 ? "Caja" : " Cajas"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="flex justify-between items-center font-bold">
                  <p>
                    Total cajas: <span>{totalCajas}</span>
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="font-semibold">
                  <p>
                    Total peso neto (lb): <span>{totalPesoNetoLibras} lbs</span>{" "}
                  </p>
                  <p>
                    Total peso bruto (lb):{" "}
                    <span>{totalPesoBrutoLibras} lbs</span>
                  </p>
                  <p>
                    Total peso neto (kg):{" "}
                    <span>{totalPesoBrutoKilos.toFixed(2)} kg</span>
                  </p>
                  <p>
                    Total peso bruto (kg):{" "}
                    <span>{totalPesoBrutoKilos.toFixed(2)} kg</span>
                  </p>
                </div>
              </div>
              <div className="w-full max-w-4xl mx-auto mt-4">
                {/* Render tables for each corte */}

                <div className="mb-8">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border border-gray-300">
                          Número de Caja
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Variedad
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Corte
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Lote
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Peso Bruto (lbs)
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Peso Neto (lbs)
                        </th>
                        <th className="px-4 py-2 border border-gray-300">
                          Calidad
                        </th>
                      </tr>
                    </thead>
                    {Object.entries(cajasPorCortes).map(
                      ([NumeroDeCaja, cajas]) => (
                        <tbody key={NumeroDeCaja}>
                          {cajas.map((caja) => (
                            <tr key={caja.NumeroDeCaja}>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.NumeroDeCaja}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.variedad}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.corte}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.lote}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.pesoBruto}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.pesoNeto}
                              </td>
                              <td className="px-4 py-2 border border-gray-300">
                                {caja.calidad}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintSolicitude;
