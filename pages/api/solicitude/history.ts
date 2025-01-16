import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import { SolicitudeModel } from "../../../lib/mongo/schemas";
import { Solicitude } from "../../../lib/types";
import { Aprobado, Terminado } from "../../../lib/utils/constants";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  try {
    const { page } = req.query;
    const currPage = Number(page);
    const solicitudes = await SolicitudeModel.find({
        EstadoSupervisor: Terminado,
    })
      .sort({ number: -1 })
      .skip(30 * (currPage - 1))
      .limit(30);
    return res.status(200).json({
      message: "todas las solicitudes",
      data: solicitudes as Array<Solicitude>,
      success: true,
    });
  } catch (error) {
    return res.status(200).json({
      message: "Todas las solicitudes",
      data: [],
      success: false,
    });
  }
}
export const config = {
  api: {
    responseLimit: false,
  },
};