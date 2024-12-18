<<<<<<< HEAD
import { ModalProps } from "../../types";
import theme from "../../styles/theme";

const ConfirmModal = (props: ModalProps<any>) => {
  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-1/3 w-5/6 md:h-1/6 h-1/5 overflow-y-auto">
        <div
              style={{ 
                color: theme.colors.grey 
              }}
              className="text-center text-xl mb-2 font-semibold"
            >
              ELIMINAR
            </div>
          <hr />
          <p className="text-center text-xl mb-2 ">
            ¿Está seguro que desea borrar este elemento?
          </p>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <button              
              className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full text-sm"
=======
import { Button, Modal } from "react-bootstrap";
import { ModalProps } from "../../types";

const ConfirmModal = (props: ModalProps<any>) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        props.visible ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-lg z-10 w-1/3 h-1/6 overflow-y-auto">
        <Modal.Header className="text-lg font-semibold">
          <Modal.Title>
            ¿Está seguro de querer borrar este elemento?
          </Modal.Title>
        </Modal.Header>

        <hr />
        <div className="justify-end mt-3 grid md:grid-cols-4 grid-cols-1 gap-4">
          <div>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full text-sm"
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
              onClick={props.onDone}
            >
              Borrar
            </button>
<<<<<<< HEAD
=======
          </div>
          <div className="md:col-end-4">
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
            <button
              className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded-full text-sm"
              onClick={props.close}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
  );
};

export default ConfirmModal;
