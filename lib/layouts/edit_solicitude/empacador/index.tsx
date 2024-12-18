import { Row, Form, Col } from "react-bootstrap";
import { useAuth } from "../../../hooks/use_auth";
import { FormikComponentProps, Solicitude } from "../../../types";
import { CheckFinished } from "../../../utils/check_permissions";
import {
  Elaborando,
  Aprobado,
  Pendiente,
  Terminado,
} from "../../../utils/constants";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const EmpacadorPanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  return (
    <Row className={inTabs ? "justify-content-center" : ""}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Label
          className={inTabs ? "ml-5 mt-3" : ""}
          style={{ color: "black" }}
        >
          Estado de empacador
        </Form.Label>
        <Form.Select
          name="estadoEmpacador"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formik.values?.estadoEmpacador}
          onChange={formik.handleChange}
          disabled={CheckFinished(
            auth,
            [2],
            formik.values?.estadoEmpacador,
            Terminado
          )}
        >
          <option>Seleccione una opción</option>
          <option value={Pendiente}>Pendiente</option>
          <option value={Terminado}>Terminado</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default EmpacadorPanel;
