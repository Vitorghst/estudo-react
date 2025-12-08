import React, { useEffect, useState } from "react";
import "./Pedidos.css";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get("http://localhost:5110/Order");
        console.log(response.data);
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos!", error);
      }
    };
    fetchPedidos();
  }, []);

  return (
    <div className="container-pedidos col-lg-10 mt-5 mx-auto">
      <div className="div-interna">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <Accordion
            defaultExpanded
              sx={{
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  backgroundColor: "#f7f7f7", // Cor de fundo
                  borderRadius: "5px",
                  color: "#333",
                }}
              >
                <Typography> Pedido: {pedido.id}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="accordion-body">
                    <div className="row row-cols-2">
                      <div className="col-md-4">
                        <div>
                          <img
                            src="../../../../assets/images/user.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Nome do Cliente:</strong> {pedido.name}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <img
                            src="../../../../assets/images/email.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Email:</strong> {pedido.email}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div>
                          <img
                            src="../../../../assets/images/phone.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Telefone/Celular:</strong> {pedido.telefone}
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div>
                          <img
                            src="../../../../assets/images/local.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Endereço de entrega:</strong> {pedido.cep},{" "}
                          {pedido.logradouro} {pedido.bairro},{" "}
                          {pedido.localidade}, {pedido.number}{" "}
                          {pedido.optionalAddress}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div>
                          <img
                            src="../../../../assets/images/calendar.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Data do Pedido:</strong> {pedido.data}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <img
                            src="../../../../assets/images/payment.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Método de Pagamento:</strong>{" "}
                          {pedido.pagamentoEntrega} {pedido.pagamentoAplicativo}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div>
                          <img
                            src="../../../../assets/images/pedidos.png"
                            alt=""
                            className="me-2"
                            width="20"
                          />
                          <strong>Itens do Pedido:</strong>
                          <button
                            className="btn btn-success btn-sm space"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Visualizar o Pedido
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <span>
                          <img
                            src="../../../../assets/images/wallet.png"
                            alt=""
                            width="20"
                          />
                          <strong> Total: </strong> {pedido.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p>Nenhum pedido encontrado.</p>
        )}
        </div>
    </div>
  );
};

export default Pedidos;
