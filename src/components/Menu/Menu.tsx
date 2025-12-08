import React, { useState, useEffect } from "react";
import "./Menu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  faCartShopping,
  faIdCard,
  faMagnifyingGlass,
  faMinus,
  faPenToSquare,
  faPlus,
  faTrash,
  faWallet,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/garfo.png";
import car from "../../assets/cardelivery.png";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import info from "../../assets/cnpj.png";
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from "@mui/material";
import Input from "@mui/joy/Input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";
import { color, motion } from "framer-motion";
import delivery from "../../assets/pizza.png";
import pizza from "../../assets/pizza-menu.png";

interface MenuProps {
  permUser: string;
  idUser: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: any;
  imagePath: string;
}

interface addMenuItem {
  name: string;
  description: string;
  category: string;
  price: any;
  imagePath: string;
}

interface editMenuItem {
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

const Menu: React.FC<MenuProps> = ({ permUser, idUser }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("Aberto");
  const [items, setItems] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [menuEditId, setMenuEditId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imagePath: "",
  });

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "#fff",
    border: "#fff",
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const listMenu = async () => {
    try {
      const response = await axios.get("http://localhost:5110/Menu");
      setMenu(response.data);
    } catch (error) {
      console.error("Erro ao buscar restaurantes!", error);
    }
  };

  const getMenuById = async (menuId: any) => {
    try {
      const response = await axios.get(`http://localhost:5110/Menu/${menuId}`);
      const menuData = response.data;

      // Seta os valores do menu no formulário
      setFormDataEdit({
        id: menuId,
        name: menuData.name,
        description: menuData.description,
        imagePath: menuData.imagePath,
        price: menuData.price,
        category: menuData.category,
      });

      setExistingImage(menuData.imagePath);
      setMenuEditId(menuId);
    } catch (error) {
      console.error(`Erro ao buscar o menu com ID ${menuId}!`, error);
    }
  };

  const getHorario = async() => {
    try {
      const response = await axios.get("http://localhost:5110/Horarios")
      console.log(response.data)
    } catch (error) {
      console.log('teste')
    }
  }

  useEffect(() => {
    listMenu();
    getHorario()
  }, []);

  useEffect(() => {
    const listMenu = async () => {
      try {
        const response = await axios.get("http://localhost:5110/Menu");
        setMenu(response.data);
      } catch (error) {
        console.error("Erro ao buscar restaurantes!", error);
      }
    };
    listMenu();
  }, []);

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchText(event.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const filtrarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
  };

  if (categoriaSelecionada !== "Todos") {
    var menuFiltrado = categoriaSelecionada
      ? menu.filter((item) => item.category === categoriaSelecionada)
      : menu;
  } else {
    var menuFiltrado = menu;
  }

  const deleteItem = async (id: any) => {
    try {
      const response = axios.delete(`http://localhost:5110/Menu/${id}`);
      enqueueSnackbar(`Item deletado com sucesso!`, { variant: "error" });

      const timer = setTimeout(() => {
        listMenu();
      }, 500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Deu erro kkkkkk", error);
    }
  };

  const editApi = (
    menuItem: React.SetStateAction<{
      name: string;
      description: string;
      price: string;
      category: string;
      imagePath: string;
    }>
  ) => {
    setEditForm(menuItem);
  };

  const updateItem = () => {
    // Implementar atualização de item
  };

  const onFileSelected = (event: any) => {
    // Implementar seleção de arquivo
  };

  const addQuantity = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const removeQuantity = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const deletItemQuantity = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    emailConfirmation: "",
    telefone: "",
    cep: "",
    logradouro: "",
    bairro: "",
    localidade: "",
    number: "",
    data: new Date().toISOString(),
    optionalAddress: "",
    status: "",
    total: "",
    pagamentoEntrega: "Dinheiro",
    pagamentoAplicativo: "",
    usuario: idUser,
    orderItems: [] as OrderItemWithoutId[],
  });

  const initialFormData: addMenuItem = {
    name: "",
    imagePath: "",
    description: "",
    price: "",
    category: "",
  };

  const editFormData: editMenuItem = {
    name: "",
    imagePath: "",
    description: "",
    price: "",
    category: "",
  };

  const [formDataAdd, setFormDataAdd] = useState<addMenuItem>(initialFormData);
  const [formDataEdit, setFormDataEdit] = useState<editMenuItem>(editFormData);
  const [existingImage, setExistingImage] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeAddItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataAdd((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeEditItem = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormDataEdit((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeAdd = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormDataAdd({
      ...formDataAdd,
      [name]: value,
    });
  };

  const handleInputChangeEdit = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormDataEdit({
      ...formDataEdit,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5110/Order",
        formData
      );
    } catch (error) {
      console.error("There was an error creating the order:", error);
    }
  };

  const editItem = async (id: any, formDataEdit: any) => {
    try {
      const response = await axios.put(
        `http://localhost:5110/Menu/${id}`,
        formDataEdit
      );

      enqueueSnackbar(`Item editado com sucesso!`, { variant: "success" });

      const timer = setTimeout(async () => {
        setOpenEdit(false);
        await listMenu();
      }, 500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Deu erro kkkkkk", error);
    }
  };

  const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impede o comportamento padrão do form
    editItem(menuEditId, formDataEdit); // Chama a função para editar o item
  };

  const handleSubmitImage = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5110/Menu/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.imagePath;
    } catch (error) {
      console.error("Error uploading file", error);
      throw error;
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Primeiro, faz o upload da imagem e obtém o caminho da imagem
      const imagePath = await handleSubmitImage();

      // Atualiza o formDataAdd com o imagePath retornado
      const updatedFormDataAdd = {
        ...formDataAdd,
        imagePath: imagePath, // Define o imagePath corretamente
      };

      // Envia o item com o formData atualizado
      const response = await axios.post(
        "http://localhost:5110/Menu/AddItem",
        updatedFormDataAdd
      );
      enqueueSnackbar(`Item adicionado com sucesso!`, { variant: "success" });

      const timer = setTimeout(async () => {
        setOpen(false);
        setFormDataAdd(initialFormData); // Reseta o formData
        await listMenu(); // Atualiza a lista de itens
      }, 500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("There was an error creating the order:", error);
    }
  };

  const emitAddEvent = (menuItem: any) => {
    setItems((prevItems) => {
      const itemIndex = prevItems.findIndex(
        (item) => item.name === menuItem.name
      );
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
    const orderItems: OrderItemWithoutId[] = items.map((item) => ({
      quantity: item.quantity,
      observacao: "", // Adicione o valor adequado ou mantenha vazio se não for necessário
      imagePath: item.imagePath,
      adicionais: "", // Adicione o valor adequado ou mantenha vazio se não for necessário
      menuId: item.name,
      order_id: 0, // Adicione o valor adequado ou mantenha zero se não for necessário
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      orderItems: orderItems,
    }));
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://cache.dominos.com/wam/prod/market/BR/_pt/images/promo/70b384ca-bb40-4561-8e65-77e6d742eaa3.png",
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div
          className={`bg-white border-radius-menu col-sm-12 ${
            items.length > 0 ? "col-md-6" : "col-md-12"
          } mt-3 border-top me-5`}
        >
          <motion.div
            style={{
              alignItems: "center",
              borderRadius: "10px",
            }}
            initial={{ y: 30 }}
            whileInView={{ y: 2 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
          >
            <div className="row">
              <div className="col-5 col-sm-7 col-md-3 col-lg-7 p-3 ms-4">
                <div className="row">
                  <div className="col-sm-4 col-md-6 col-lg-2">
                    <h5 className="tipografia">
                      <img src={pizza} className="mb-1" alt="" width="40" />{" "}
                      Menu
                    </h5>
                  </div>
                  <div className="col-sm-4 col-md-5 col-lg-4" style={{ margin: "8px 0px 0px 0px"}}>
                       <FontAwesomeIcon icon={faCircle} style={{ color: "red" }} /> Aberto
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-4 col-md-6 col-lg-4 p-3">
                {permUser === "A" && (
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="btn btn-success ms-4 float-right shadow btn-sm space text-decoration-none"
                    data-bs-toggle="modal"
                    data-bs-target="#adicionarItem"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Adicionar items
                  </button>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="col-xs-10 col-sm-12 col-md-10 col-lg-12">
                <button
                  className="btn btn-danger-filter me-2 mb-2 button-menu"
                  type="button"
                  onClick={() => filtrarCategoria("Todos")}
                >
                  Todos
                </button>
                <button
                  className="btn btn-danger-filter me-2 mb-2 button-menu"
                  type="button"
                  onClick={() => filtrarCategoria("Cachorro Quente")}
                >
                  Cachorro Quente
                </button>
                <button
                  className="btn btn-danger-filter me-2 mb-2 button-menu"
                  type="button"
                  onClick={() => filtrarCategoria("Lanches")}
                >
                  Lanches
                </button>
                <button
                  className="btn btn-danger-filter me-2 mb-2 button-menu"
                  type="button"
                  onClick={() => filtrarCategoria("Hamburguer Artesanal")}
                >
                  Hamburguer Artesanal
                </button>
                <button
                  className="btn btn-danger-filter me-2 mb-2 button-menu"
                  type="button"
                  onClick={() => filtrarCategoria("Refrigerantes")}
                >
                  Refrigerantes
                </button>
              </div>
              <hr />
              <div className="col-md-2 input-group rounded">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Pesquisar Produto"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <span className="input-group-text">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                </div>
              </div>

              <div className="content-body">
                <hr className="bg-black" />
                {menuFiltrado
                  .filter((item) => item.name.includes(searchText))
                  .map((menuItem, index) => (
                    <div className="row" key={index}>
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        {menuItem.imagePath && (
                          <img
                            width="90%"
                            src={`http://localhost:5110${menuItem.imagePath}`}
                          />
                        )}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-8">
                        <h3 className="mt-2 tipografia">
                          {menuItem.name}
                          {permUser === "A" && (
                            <>
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{ color: "#ff0000" }}
                                className="float-right pointer"
                                onClick={() => deleteItem(menuItem.id)}
                              />
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                style={{ color: "#0f7dd2" }}
                                className="float-right pointer me-2"
                                onClick={() => {
                                  handleOpenEdit();
                                  getMenuById(menuItem.id);
                                }}
                              />
                            </>
                          )}
                        </h3>
                        <span>{menuItem.description}</span>
                        <br />
                        <p>{menuItem.category}</p>
                        <div className="mt-2">
                          <span className="mt-3">
                            <FontAwesomeIcon color="brown" icon={faWallet} />{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(menuItem.price)}
                          </span>
                          {status === "Aberto" && (
                            <button
                              type="button"
                              onClick={() => emitAddEvent(menuItem)}
                              className="btn btn-color ms-4 shadow btn-sm space text-decoration-none"
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{ color: "#ffffff", marginRight: "3px" }}
                              />
                              Adicionar
                            </button>
                          )}
                        </div>
                      </div>
                      <hr className="mt-2 bg-black" />
                    </div>
                  ))}
                <div
                  className="modal fade"
                  id="editarItem"
                  data-bs-backdrop="static"
                  data-bs-keyboard="false"
                  aria-labelledby="staticBackdropLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <img
                          src="../../assets/images/shopp-admin.png"
                          alt=""
                          className="me-2"
                          width="35"
                        />
                        <h5
                          className="modal-title ms-2"
                          id="staticBackdropLabel"
                        >
                          Editar Item
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="fw-bold col-md-12 offset-md-2">
                            <div>
                              <div className="d-flex flex-row align-items-center mb-4">
                                <img
                                  src="../../../../assets/images/pedidos.png"
                                  alt=""
                                  className="me-2 mt-4"
                                  width="35"
                                />
                                <div className="form-outline flex-fill ">
                                  <label className="mb-1" htmlFor="name">
                                    Nome do Item:
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        name: e.target.value,
                                      })
                                    }
                                    className="additem"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex flex-row align-items-center mb-4">
                                <img
                                  src="../../../../assets/images/info.png"
                                  alt=""
                                  className="me-2 mt-4"
                                  width="35"
                                />
                                <div className="form-outline flex-fill ">
                                  <label className="mb-1" htmlFor="description">
                                    Descrição do Item:
                                  </label>
                                  <input
                                    type="text"
                                    id="description"
                                    value={editForm.description}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        description: e.target.value,
                                      })
                                    }
                                    className="additem"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex flex-row align-items-center mb-4">
                                <img
                                  src="../../../../assets/images/payment.png"
                                  alt=""
                                  className="me-2 mt-4"
                                  width="35"
                                />
                                <div className="form-outline flex-fill ">
                                  <label className="mb-1" htmlFor="price">
                                    Preço do Item:
                                  </label>
                                  <input
                                    type="number"
                                    id="price"
                                    value={editForm.price}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        price: e.target.value,
                                      })
                                    }
                                    className="additem"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex flex-row align-items-center mb-4">
                                <img
                                  src="../../../../assets/images/category.png"
                                  alt=""
                                  className="me-2 mt-4"
                                  width="35"
                                />
                                <div className="form-outline flex-fill ">
                                  <label className="mb-1" htmlFor="category">
                                    Categoria do Item:
                                  </label>
                                  <input
                                    type="text"
                                    id="category"
                                    value={editForm.category}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        category: e.target.value,
                                      })
                                    }
                                    className="additem"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="d-flex flex-row align-items-center mb-4">
                                <img
                                  src="../../../../assets/images/upload.png"
                                  alt=""
                                  className="me-2 mt-4"
                                  width="35"
                                />
                                <div className="form-outline flex-fill ">
                                  <label className="mb-1" htmlFor="imagePath">
                                    Imagem do Item:
                                  </label>
                                  <input
                                    type="file"
                                    id="imagePath"
                                    onChange={onFileSelected}
                                    className="additem"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={updateItem}
                        >
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-sm-12 col-md-4 col-lg-5">
          <div className="row mt-3">
            {items.length > 0 && (
              <div className="list-group col-sm-12 col-md-12 col-lg-12 border-top content-order bg-white">
                <h5 className="tipografia padding-car">
                  <img src={car} height={35}></img> Carrinho
                </h5>
                <div className="content-body">
                  {items.map((item, index) => (
                    <div
                      className="d-flex justify-content-between align-items-center"
                      key={index}
                    >
                      <div className="container">
                        <div className="row mt-3">
                          <div className="col">
                            {item.imagePath && (
                              <img
                                width="110%"
                                src={`http://localhost:5110${item.imagePath}`}
                              />
                            )}
                          </div>
                          <div className="col">
                            {item.name}
                            <br></br>
                            <span className="badge bg-blue rounded-pill">
                              R$ {item.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="col mb-3">
                            {item.quantity !== 1 && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeQuantity(item.id)}
                                disabled={item.quantity === 1}
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                            )}
                            {item.quantity === 1 && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deletItemQuantity(item.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => addQuantity(item.id)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* <div
              className={
                items.length > 0
                  ? "list-group border-top max-height-order mt-3 content-body bg-white"
                  : "list-group border-top max-height-order content-body bg-white"
              }
            >
              <motion.div
                style={{
                  alignItems: "center",
                  borderRadius: "10px",
                }}
                initial={{ y: 30 }} // Começa fora da tela à esquerda
                whileInView={{ y: 2 }} // Se move para a posição original
                viewport={{ once: true, amount: 0 }} // Anima quando estiver 50% visível
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              >
                <h5 className="tipografia mb-4">
                  <img src={delivery} height={30} className="me-1"></img>
                  Informações para entrega
                </h5>
                <div className="content-body">
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                      <Grid item xs={8} md={12} lg={12}>
                        <TextField
                          id="name"
                          name="name"
                          label="Nome"
                          variant="outlined"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="email"
                          name="email"
                          label="Email"
                          variant="outlined"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="emailConfirmation"
                          name="emailConfirmation"
                          label="Email Confirmation"
                          variant="outlined"
                          type="email"
                          value={formData.emailConfirmation}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="telefone"
                          name="telefone"
                          label="Telefone"
                          variant="outlined"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="cep"
                          name="cep"
                          label="CEP"
                          variant="outlined"
                          value={formData.cep}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="logradouro"
                          name="logradouro"
                          label="Logradouro"
                          variant="outlined"
                          value={formData.logradouro}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="bairro"
                          name="bairro"
                          label="Bairro"
                          variant="outlined"
                          value={formData.bairro}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          id="localidade"
                          name="localidade"
                          label="Localidade"
                          variant="outlined"
                          value={formData.localidade}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="number"
                          name="number"
                          label="Number"
                          variant="outlined"
                          value={formData.number}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="optionalAddress"
                          name="optionalAddress"
                          label="Optional Address"
                          variant="outlined"
                          value={formData.optionalAddress}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="status"
                          name="status"
                          label="Status"
                          variant="outlined"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                          sx={{
                            '& label.Mui-focused': {
                              color: 'red', // muda a cor do label focado
                            },
                            '& .MuiInputLabel-asterisk': {
                              color: 'red', // muda a cor do asterisco
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="pagamentoEntrega"
                          name="pagamentoEntrega"
                          label="Pagamento"
                          variant="outlined"
                          value={formData.pagamentoEntrega}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Button
                      className="botao-finalizar"
                      variant="contained"
                      type="submit"
                      color="success"
                    >
                      Finalizar
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div> */}
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h5 className="tipografia mb-4">
                <img src={info} className="mb-1 me-2" alt="" width="30" />{" "}
                Adicionar item
              </h5>
              <form onSubmit={handleAddItem}>
                <Grid container spacing={4}>
                  <Grid item xs={8} md={12} lg={12}>
                    <TextField
                      id="name"
                      name="name"
                      label="Nome"
                      variant="outlined"
                      value={formDataAdd.name}
                      onChange={handleInputChangeAddItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="description"
                      name="description"
                      label="Descrição"
                      variant="outlined"
                      type="description"
                      value={formDataAdd.description}
                      onChange={handleInputChangeAddItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="price"
                      name="price"
                      label="Preço"
                      variant="outlined"
                      type="number"
                      value={formDataAdd.price}
                      onChange={handleInputChangeAddItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel id="category-label">Categoria</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formDataAdd.category}
                        onChange={handleInputChangeAdd}
                        label="Categoria"
                      >
                        <MenuItem value="">
                          <em>Nenhuma</em>
                        </MenuItem>
                        <MenuItem value="Cachorro Quente">
                          Cachorro Quente
                        </MenuItem>
                        <MenuItem value="Lanches">Lanches</MenuItem>
                        {/* Adicione mais opções conforme necessário */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <input type="file" onChange={handleFileChange} />
                  </Grid>
                </Grid>
                <Button
                  className="botao-finalizar"
                  variant="contained"
                  type="submit"
                  color="success"
                >
                  Finalizar
                </Button>
              </form>
            </Box>
          </Modal>

          <Modal
            open={openEdit}
            onClose={handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h5 className="tipografia mb-4">
                <img src={info} className="mb-1 me-2" alt="" width="30" />{" "}
                Editar item
              </h5>
              <form onSubmit={handleSubmitEdit}>
                <Grid container spacing={4}>
                  <Grid item xs={8} md={12} lg={12}>
                    <TextField
                      id="name"
                      name="name"
                      label="Nome"
                      variant="outlined"
                      value={formDataEdit.name}
                      onChange={handleInputChangeEditItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="description"
                      name="description"
                      label="Descrição"
                      variant="outlined"
                      type="description"
                      value={formDataEdit.description}
                      onChange={handleInputChangeEditItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="price"
                      name="price"
                      label="Preço"
                      variant="outlined"
                      type="number"
                      value={formDataEdit.price}
                      onChange={handleInputChangeEditItem}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel id="category-label">Categoria</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formDataEdit.category}
                        onChange={handleInputChangeEdit}
                        label="Categoria"
                      >
                        <MenuItem value="">
                          <em>Nenhuma</em>
                        </MenuItem>
                        <MenuItem value="Cachorro Quente">
                          Cachorro Quente
                        </MenuItem>
                        <MenuItem value="Lanches">Lanches</MenuItem>
                        {/* Adicione mais opções conforme necessário */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    {existingImage && (
                      <div className="row">
                        <div className="col-md-6 mt-3">
                          <h5>Imagem Atual:</h5>
                        </div>
                        <div className="col-md-4">
                          <img
                            src={`http://localhost:5110/${existingImage}`}
                            alt="Current"
                            width="90"
                          />
                        </div>
                        <input
                          type="file"
                          className="mt-5 me-4"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Button
                  className="botao-finalizar"
                  variant="contained"
                  type="submit"
                  color="success"
                >
                  Finalizar
                </Button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Menu;
