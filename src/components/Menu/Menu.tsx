import React, { useState, useEffect } from 'react';
import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { faCartShopping, faMagnifyingGlass, faMinus, faPenToSquare, faPlus, faTrash, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/pedidos.png';
import car from '../../assets/cartcarrinho.png'


interface MenuProps {
  permUser: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: any;
  imagePath: string;
}

interface ItemList extends MenuItem {
  quantity: number;
}

interface OrderItemWithoutId {
  quantity: number;
  observacao: string;
  imagePath: string;
  adicionais: string;
  menuId: string;
  order_id: number;
}

interface FormData {
  name: string;
  email: string;
  emailConfirmation: string;
  telefone: string;
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  number: string;
  data: string;
  optionalAddress: string;
  status: string;
  total: string;
  pagamentoEntrega: string;
  pagamentoAplicativo: string;
  usuario: number;
  orderItems: OrderItemWithoutId[];
}

const Menu: React.FC<MenuProps> = ({ permUser }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Aberto');
  const [items, setItems] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: '', imagePath: '' });

  useEffect(() => {
    const listMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5110/Menu');
        setMenu(response.data);
      } catch (error) {
        console.error('Erro ao buscar restaurantes!', error);
      }
    };
    listMenu();
  }, []);

  const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchText(event.target.value);
  };


  const filtrarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
    console.log(categoriaSelecionada)
  };

  if (categoriaSelecionada !== 'Todos') {
    var menuFiltrado = categoriaSelecionada ? menu.filter(item => item.category === categoriaSelecionada) : menu;
  } else {
    var menuFiltrado = menu
  }


  const deleteItem = (id: any) => {
    // Implementar exclusão de item
  };

  const editApi = (menuItem: React.SetStateAction<{ name: string; description: string; price: string; category: string; imagePath: string; }>) => {
    setEditForm(menuItem);
  };

  const updateItem = () => {
    // Implementar atualização de item
  };

  const onFileSelected = (event: any) => {
    // Implementar seleção de arquivo
  };

  const addQuantity = (id: number) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const removeQuantity = (id: number) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    emailConfirmation: '',
    telefone: '',
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    number: '',
    data: new Date().toISOString(),
    optionalAddress: '',
    status: '',
    total: '',
    pagamentoEntrega: '',
    pagamentoAplicativo: '',
    usuario: 0,
    orderItems: [] as OrderItemWithoutId[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post('http://localhost:5110/Order', formData);
      console.log('Order created:', response.data);
    } catch (error) {
      console.error('There was an error creating the order:', error);
    }
  };

  const emitAddEvent = (menuItem: any) => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.name === menuItem.name);
      if (itemIndex !== -1) {
        // Item já existe, incrementa a quantidade
        const newItems = prevItems.map((item, index) => 
          index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateFormDataOrderItems(newItems);
        return newItems;
      } else {
        // Item não existe, adiciona novo item com quantidade 1
        const newItem = { ...menuItem, quantity: 1 };
        const updatedItems = [...prevItems, newItem];
        updateFormDataOrderItems(updatedItems);
        return updatedItems;
      }
    });
  };
  
  const updateFormDataOrderItems = (items: any[]) => {
    const orderItems: OrderItemWithoutId[] = items.map(item => ({
      quantity: item.quantity,
      observacao: '',  // Adicione o valor adequado ou mantenha vazio se não for necessário
      imagePath: item.imagePath,
      adicionais: '',  // Adicione o valor adequado ou mantenha vazio se não for necessário
      menuId: item.name,
      order_id: 0 // Adicione o valor adequado ou mantenha zero se não for necessário
    }));
    setFormData(prevFormData => ({
      ...prevFormData,
      orderItems: orderItems
    }));
    console.log(formData)
  };
  

  return (
    <div className='container'>
      <div className='row'>
        <div className="bg-white border-radius-menu col-sm-12 col-md-6 mt-3 me-4 border-top">
          <div className='row'>
            <div className="col-sm-6 col-md-3 col-lg-7 p-3 ms-4">
              <h5 className="tipografia"><img src={logo} className="mb-1" alt="" width="30" /> Menu</h5>
            </div>
            <div className="col-sm-4 col-md-6 col-lg-4 p-3">
              {permUser === 'A' && (
                <button type="button"
                  className="btn btn-success ms-4 float-right shadow btn-sm space text-decoration-none"
                  data-bs-toggle="modal" data-bs-target="#adicionarItem">
                  <FontAwesomeIcon icon={faPlus} /> Adicionar items
                </button>
              )}
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
              <button className="btn btn-danger-filter me-2 mb-2 button-menu" type="button"
                onClick={() => filtrarCategoria('Todos')}>Todos</button>
              <button className="btn btn-danger-filter me-2 mb-2 button-menu" type="button"
                onClick={() => filtrarCategoria('Cachorro Quente')}>Cachorro Quente</button>
              <button className="btn btn-danger-filter me-2 mb-2 button-menu" type="button"
                onClick={() => filtrarCategoria('Lanches')}>Lanches</button>
              <button className="btn btn-danger-filter me-2 mb-2 button-menu" type="button"
                onClick={() => filtrarCategoria('Hamburguer Artesanal')}>Hamburguer Artesanal</button>
              <button className="btn btn-danger-filter me-2 mb-2 button-menu" type="button"
                onClick={() => filtrarCategoria('Refrigerantes')}>Refrigerantes</button>
            </div>
            <hr />
            <div className="col-md-2 input-group rounded">
              <input type="search" className="form-control mt-3 border" value={searchText} onChange={handleSearchChange}
                placeholder="Pesquisar Produto" aria-label="Search" aria-describedby="search-addon" />
              <span className="input-group-text mt-3 border-0" id="search-addon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
            <div className="content-body">
              <hr className="bg-black" />
              {menuFiltrado.filter(item => item.name.includes(searchText)).map((menuItem, index) => (
                <div className="row" key={index}>
                  <div className="col-sm-8 col-md-4">
                    <img width="90%" className='margin-food' src={menuItem.imagePath} alt={menuItem.name} />
                  </div>
                  <div className="col-sm-6 col-md-12 col-lg-8">
                    <h3 className="mt-2 tipografia">
                      {menuItem.name}
                      {permUser === 'A' && (
                        <>
                          <FontAwesomeIcon icon={faTrash} className='float-right pointer' onClick={() => deleteItem(menuItem.id)} />
                          <FontAwesomeIcon icon={faPenToSquare} className='float-right pointer me-2' onClick={() => editApi(menuItem)} data-bs-toggle="modal" data-bs-target="#editarItem" />
                        </>
                      )}
                    </h3>
                    <span>{menuItem.description}</span>
                    <br />
                    <p>{menuItem.category}</p>
                    <div className="mt-2">
                      <span className="mt-3"><FontAwesomeIcon icon={faWallet} /> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(menuItem.price)}</span>
                      {status === 'Aberto' && (
                        <button type="button" onClick={() => emitAddEvent(menuItem)}
                          className="btn btn-color ms-4 shadow btn-sm space text-decoration-none" >
                          <img src="../../../../assets/images/cart.png" alt="" className="mb-1" width="23" /> Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                  <hr className="mt-2 bg-black" />
                </div>
              ))}
              <div className="modal fade" id="editarItem" data-bs-backdrop="static" data-bs-keyboard="false"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <img src="../../assets/images/shopp-admin.png" alt="" className="me-2" width="35" />
                      <h5 className="modal-title ms-2" id="staticBackdropLabel">Editar Item</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="fw-bold col-md-12 offset-md-2">
                          <div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <img src="../../../../assets/images/pedidos.png" alt="" className="me-2 mt-4" width="35" />
                              <div className="form-outline flex-fill ">
                                <label className="mb-1" htmlFor="name">Nome do Item:</label>
                                <input type="text" id="name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="additem" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <img src="../../../../assets/images/info.png" alt="" className="me-2 mt-4" width="35" />
                              <div className="form-outline flex-fill ">
                                <label className="mb-1" htmlFor="description">Descrição do Item:</label>
                                <input type="text" id="description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="additem" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <img src="../../../../assets/images/payment.png" alt="" className="me-2 mt-4" width="35" />
                              <div className="form-outline flex-fill ">
                                <label className="mb-1" htmlFor="price">Preço do Item:</label>
                                <input type="number" id="price" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="additem" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <img src="../../../../assets/images/category.png" alt="" className="me-2 mt-4" width="35" />
                              <div className="form-outline flex-fill ">
                                <label className="mb-1" htmlFor="category">Categoria do Item:</label>
                                <input type="text" id="category" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="additem" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <img src="../../../../assets/images/upload.png" alt="" className="me-2 mt-4" width="35" />
                              <div className="form-outline flex-fill ">
                                <label className="mb-1" htmlFor="imagePath">Imagem do Item:</label>
                                <input type="file" id="imagePath" onChange={onFileSelected} className="additem" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                      <button type="button" className="btn btn-primary" onClick={updateItem}>Salvar alterações</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 border-top mt-3 content-body bg-white">

          <div className="row mt-3">
            <div className="col-md-12">

            <div className="list-group">
                {items.map((item, index) => (
                  <div className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                    <div className='col-sm-10 col-md-9 width-col col-lg-9'>
                      <h6>{item.name}</h6>
                      <p className="mb-0">{item.description}</p>
                      <span className="badge bg-primary rounded-pill">R$ {item.price.toFixed(2)}</span>
                    </div>
                    <div className='col-sm-4 col-lg-4 width-col'>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeQuantity(item.id)} disabled={item.quantity === 1}>
                        <FontAwesomeIcon icon={faMinus} />

                      </button>

                      <span className="mx-2">{item.quantity}</span>
                      <button className="btn btn-outline-success btn-sm" onClick={() => addQuantity(item.id)}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='mt-2'>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Email Confirmation:</label>
                <input type="email" name="emailConfirmation" value={formData.emailConfirmation} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Telefone:</label>
                <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} required />
              </div>
              <div>
                <label>CEP:</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Logradouro:</label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Bairro:</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Localidade:</label>
                <input type="text" name="localidade" value={formData.localidade} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Number:</label>
                <input type="text" name="number" value={formData.number} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Optional Address:</label>
                <input type="text" name="optionalAddress" value={formData.optionalAddress} onChange={handleInputChange} />
              </div>
              <div>
                <label>Status:</label>
                <input type="text" name="status" value={formData.status} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Total:</label>
                <input type="text" name="total" value={formData.total} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Pagamento Entrega:</label>
                <input type="text" name="pagamentoEntrega" value={formData.pagamentoEntrega} onChange={handleInputChange} />
              </div>
              <div>
                <label>Pagamento Aplicativo:</label>
                <input type="text" name="pagamentoAplicativo" value={formData.pagamentoAplicativo} onChange={handleInputChange} />
              </div>
              <div>
                <label>Usuario:</label>
                <input type="number" name="usuario" value={formData.usuario} onChange={handleInputChange} required />
              </div>

              <button type="submit">Create Order</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Menu;
