import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import './Produtos.css'
import store from '../Store/Store'; // Supondo que você tenha um arquivo de store separado
import logo from '../../assets/logo2.png'
import star from '../../assets/star.png'
import local from '../../assets/local.png'
import phone from '../../assets/phone.png'
import moto from '../../assets/moto.png'
import bag from '../../assets/bag.png'
import box from '../../assets/box.png'
import payment from '../../assets/payment.png'
import axios from 'axios';
import Menu from '../Menu/Menu';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';


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
  telefone: any
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
  telefone: any
}

const Produtos = () => {

  const location = useLocation();
  const { permission } = location.state || {};
  const { userId } = location.state || {};

  moment.locale('pt-br');

  const dispatch = useDispatch();

  const [restaurants, setRestaurants] = useState<Restaurante>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [status, setStatus] = useState('');
  const [horario, setHorario] = useState('');
  const [funcionamento, setFuncionamento] = useState<Funcionamento>();;

  const dataAtual = moment();
  const diaDaSemana = dataAtual.format('dddd');


  const diasDaSemanaMap = {
    'domingo': 'Sunday',
    'segunda-feira': 'Monday',
    'terça-feira': 'Tuesday',
    'quarta-feira': 'Wednesday',
    'quinta-feira': 'Thursday',
    'sexta-feira': 'Friday',
    'sábado': 'Saturday'
  };

  const ordemDias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  useEffect(() => {
    console.log(permission)
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5110/Restaurants');
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Erro ao buscar restaurantes!', error);
      }
    };

    const fetchHorarios = async () => {
      try {
        const response = await axios.get('http://localhost:5110/Horarios');
        const horariosData = response.data;

        horariosData.forEach((horario: any) => {
          const diaEmIngles = diasDaSemanaMap[horario.dia.toLowerCase()];
          if (diaEmIngles === diaDaSemana) {
            if (horario.status === 'Fechado') {
              setStatus('Fechado');
            } else {
              setFuncionamento(horario);
            }
          }
        });

        setHorarios(horariosData);
      } catch (error) {
        console.error('Erro ao buscar horários!', error);
      }
    };

    fetchRestaurants();
    fetchHorarios();
  }, []);

  useEffect(() => {
    if (funcionamento) {
      const startTime = moment(funcionamento.startTime, 'HH:mm');
      const endTime = moment(funcionamento.endTime, 'HH:mm');
      const currentTime = moment(dataAtual.format('HH:mm'), 'HH:mm');

      if (currentTime.isBetween(startTime, endTime)) {
        setStatus('Aberto');
        setHorario('- Fecha às ' + funcionamento.endTime);
      } else {
        setStatus('Fechado');
        let proximoHorario = null;
        for (let i = 1; i < 7; i++) {
          const nextDayIndex = (ordemDias.indexOf(funcionamento.dia.toLowerCase()) + i) % 7;
          const nextDay = ordemDias[nextDayIndex];
          const nextOpening = horarios.find(h => h.dia.toLowerCase() === nextDay);
          if (nextOpening) {
            proximoHorario = nextOpening.startTime;
            break;
          }
        }
        setHorario(proximoHorario ? '- Abre às ' + proximoHorario : '- Não há próximo horário de abertura');
      }
    }
  }, [funcionamento, horarios, dataAtual, ordemDias]);

  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div>
      <div className="main">
        <div className="shadow">
          <div className="container-img border-bottom">
            <div className="col-md-5 offset-md-1 mb-5 border-bottom-2">
              <div>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && restaurants.length > 0 && restaurants.map((restaurant) => (
                  <div key={restaurant.id}>
                    <div className="row">
                      <div className="col-md-2 col-sm-2">
                        <img src={logo} data-bs-toggle="dropdown" width="73%" alt="" />
                      </div>
                      <div className="col-md-4 offset-md-2 text-white mt-1">
                        <h2 className='text-center'>{restaurant.name}</h2>
                      </div>
                      <div className="col-md-4 mt-1">
                        <a className="pull-right text-decoration-none avaliacao tipografia-icon text-white" id="reviews">
                          <button className="btn color-orange padding-star" type="submit">
                            <img src={star} className="mb-1" alt="" width="30" />
                            <span className="me-1 ms-1">4.5</span>
                          </button>
                        </a>
                      </div>
                    </div>
                    <hr />
                    <div className="row">

                      <div className="col-md-10 offset-md-1">
                        <span
                          className="text-horario text-white ms-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            style={{ color: status === 'Aberto' ? 'green' : 'red' }}
                          />
                          {` ${status} ${horario}`}
                        </span>
                        <div className="mt-1 me-4">
                          <p className="text-white">
                            <img src={local} alt="" width="30" />
                            {restaurant.endereco}, {restaurant.cidade}, {restaurant.estado}
                          </p>
                        </div>
                        <div className="mt-3 me-4">
                          <p className="text-white">
                            <img src={phone} alt="" width="25" />
                            {restaurant.telefone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-5 offset-md-1 tipografia-icon text-white mb-2">
                        <img src={moto} alt="" width="30" /> Entrega em até {restaurant.entregaTempo} min
                      </div>
                      <div className="col-md-4 offset-md-1 tipografia-icon text-white">
                        <img src={box} alt="" width="30" /> Retirada em {restaurant.retirada} min.
                      </div>
                      <div className="w-100"></div>
                      <div className="col-md-5 offset-md-1 tipografia-icon mb-2 text-white">
                        <img src={bag} alt="" width="30" /> Pedido mínimo de {formatCurrency(restaurant.pedidoMin)}
                      </div>
                      <div className="col-md-4 offset-md-1 tipografia-icon mb-2 text-white">
                        <img src={payment} alt="" className="me-1" width="30" /> Frete de {formatCurrency(restaurant.frete)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Menu permUser={permission} idUser={userId}/>
    </div>
  );
}

export default Produtos;