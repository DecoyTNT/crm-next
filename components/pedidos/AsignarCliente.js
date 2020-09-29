import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from './../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      creado
      vendedor 
    }
  }
`;

const AsignarCliente = () => {

    const [cliente, setCliente] = useState({});

    // Context de pedidos
    const { agregarCliente } = useContext(PedidoContext);

    // Consultar la base de datos
    const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    const seleccionarCliente = opcion => {
        setCliente(opcion);
    }

    if (loading) return null;
    const { obtenerClientesVendedor } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un cliente al pedido</p>
            <Select
                className="mt-3"
                options={obtenerClientesVendedor}
                onChange={opcion => seleccionarCliente(opcion)}
                getOptionValue={opciones => opciones.id}
                getOptionLabel={opciones => opciones.nombre}
                placeholder="Selecciona un cliente"
                noOptionsMessage={() => "No se encontro el cliente"}
            />
        </>
    );
}

export default AsignarCliente;