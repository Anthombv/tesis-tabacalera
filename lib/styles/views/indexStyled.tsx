type Props = {
  state: string;
};

export const StateField = (props: Props) => {
  let color = "white";

  switch (props.state) {
<<<<<<< HEAD
    case "Aprobado":
=======
    case "Terminado":
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
      color = "rgb(193 243 190)";
      //color = "#86efac";
      break;
    case "Procesando":
      color = "#aed8fb";
      break;
    case "Elaborando":
      //color = "#ffdd9e";
      //color = "#fde68a";
<<<<<<< HEAD
      color = "#fecdd3" ;
=======
      color = "#fecdd3";
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
      break;
    case "Pendiente":
      color = "#ffdd9e";
      break;
    case "Abierto":
      color = "#ffdd9e";
      break;
    case "Cerrado":
      color = "rgb(193 243 190)";
      break;
    case "Rechazado":
      //color = "#b78c8a";
<<<<<<< HEAD
      color = "#fb7185";      
=======
      color = "#fb7185";
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
      break;
  }

  return (
    <p
      style={{
        backgroundColor: color,
        color: "#475569",
        //color: "#fffff",
        fontSize: "10px",
        margin: 1,
        borderRadius: "8px",
<<<<<<< HEAD
        fontWeight: "600"
=======
        fontWeight: "600",
>>>>>>> 49fc803892827a301c7d26a029c89d770fccf31e
      }}
    >
      {props.state.toUpperCase()}
    </p>
  );
};
