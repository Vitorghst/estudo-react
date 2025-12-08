import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import "./Produtos.css";
import store from "../Store/Store"; // Supondo que você tenha um arquivo de store separado
import logo from "../../assets/garfo.png";
import star from "../../assets/star.png";
import local from "../../assets/local.png";
import phone from "../../assets/phone.png";
import moto from "../../assets/moto.png";
import bag from "../../assets/bag.png";
import box from "../../assets/box.png";
import payment from "../../assets/payment.png";
import axios from "axios";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import "moment/locale/pt-br";
import {
  faBasketShopping,
  faBox,
  faClock,
  faMapPin,
  faMoneyBill,
  faMotorcycle,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import video from "../../assets/124821-732633107_small.mp4";

export type store = {
  count: number;
};

export const useTypedSelector: TypedUseSelectorHook<store> = useSelector;

interface Funcionamento {
  id: any;
  startTime: any;
  endTime: any;
  dia: any;
  entregaTempo: any;
  retirada: any;
  pedidoMin: any;
  frete: any;
  endereco: any;
  cidade: any;
  estado: any;
  telefone: any;
}

interface Restaurante {
  id: any;
  name: any;
  entregaTempo: any;
  retirada: any;
  pedidoMin: any;
  frete: any;
  endereco: any;
  cidade: any;
  estado: any;
  telefone: any;
}

const Produtos = () => {
  const location = useLocation();
  const { permission } = location.state || {};
  const { userId } = location.state || {};

  moment.locale("pt-br");

  const dispatch = useDispatch();

  const [restaurants, setRestaurants] = useState<Restaurante>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [status, setStatus] = useState("");
  const [horario, setHorario] = useState("");
  const [funcionamento, setFuncionamento] = useState<Funcionamento>();

  const dataAtual = moment();
  const diaDaSemana = dataAtual.format("dddd");

  const diasDaSemanaMap = {
    domingo: "Sunday",
    "segunda-feira": "Monday",
    "terça-feira": "Tuesday",
    "quarta-feira": "Wednesday",
    "quinta-feira": "Thursday",
    "sexta-feira": "Friday",
    sábado: "Saturday",
  };

  const ordemDias = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  useEffect(() => {
    console.log(permission);
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:5110/Restaurants");
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Erro ao buscar restaurantes!", error);
      }
    };

    const fetchHorarios = async () => {
      try {
        const response = await axios.get("http://localhost:5110/Horarios");
        const horariosData = response.data;

        horariosData.forEach((horario: any) => {
          const diaEmIngles = diasDaSemanaMap[horario.dia.toLowerCase()];
          if (diaEmIngles === diaDaSemana) {
            if (horario.status === "Fechado") {
              setStatus("Fechado");
            } else {
              setFuncionamento(horario);
            }
          }
        });

        setHorarios(horariosData);
      } catch (error) {
        console.error("Erro ao buscar horários!", error);
      }
    };

    fetchRestaurants();
    fetchHorarios();
  }, []);

  useEffect(() => {
    if (funcionamento) {
      const startTime = moment(funcionamento.startTime, "HH:mm");
      const endTime = moment(funcionamento.endTime, "HH:mm");
      const currentTime = moment(dataAtual.format("HH:mm"), "HH:mm");

      if (currentTime.isBetween(startTime, endTime)) {
        setStatus("Aberto");
        setHorario("- Fecha às " + funcionamento.endTime);
      } else {
        setStatus("Fechado");

        // Verificar se o restaurante ainda vai abrir hoje
        if (currentTime.isBefore(startTime)) {
          setHorario("- Abre às " + funcionamento.startTime);
        } else {
          // Procurar o próximo horário de funcionamento em outros dias
          let proximoHorario = null;
          for (let i = 1; i < 7; i++) {
            const nextDayIndex =
              (ordemDias.indexOf(funcionamento.dia.toLowerCase()) + i) % 7;
            const nextDay = ordemDias[nextDayIndex];
            const nextOpening = horarios.find(
              (h) => h.dia.toLowerCase() === nextDay
            );
            if (nextOpening) {
              proximoHorario = nextOpening.startTime;
              break;
            }
          }

          setHorario(
            proximoHorario
              ? "- Abre às " + proximoHorario
              : "- Não há próximo horário de abertura"
          );
        }
      }
    }
  }, [funcionamento, horarios, dataAtual, ordemDias]);

  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const images = [
    "https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png",
    "https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png",
    "https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png"
  ];

  

  useEffect(() => {
    // const interval = setInterval(() => {
    //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    // }, 10000); // Troca a cada 3 segundos
    // return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <div className="main">
      <Menu permUser={permission} idUser={userId} />
      </div>
    </div>
  );
};

export default Produtos;
