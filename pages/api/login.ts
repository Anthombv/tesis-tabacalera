import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/middlewares/mongo";
import { UserModel } from "../../lib/mongo/schemas";
import { User } from "../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userName, password } = req.body;

    // connect to the database
    await dbConnect();

<<<<<<< HEAD
    if (req.method === 'POST') {
      // fetch the posts
      const user = await UserModel.findOne({ userName, password }, { password: 0 });

      if (user !== null) {
        return res.status(200).json({
          message: "Bienvenido!",
          data: user as User,
          success: true,
=======
    if (req.method === "POST") {
      // fetch the posts
      const user = await UserModel.findOne(
        { userName, password },
        { password: 0 }
      );
      console.log(user);
      if (user.estado === "Activo") {
        if (user !== null) {
          return res.status(200).json({
            message: "Bienvenido!",
            data: user as User,
            success: true,
          });
        }
      } else {
        return res.status(404).json({
          message: "El usuario se encuentra inactivo",
          success: false,
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
        });
      }

      // return the posts
      return res.status(404).json({
        message: "Verifique los datos ingresados",
        success: false,
      });
    }
<<<<<<< HEAD
    throw new Error('Invalid method')
=======
    throw new Error("Invalid method");
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
  } catch (error) {
    // return the error
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}
