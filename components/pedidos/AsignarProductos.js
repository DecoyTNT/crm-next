import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from './../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos{
        obtenerProductos {
            id
            nombre
            existencia
            precio
        }
    }
`;

const AsignarProductos = () => {

    const [productos, setProductos] = useState([]);

    // Context de pedidos
    const { agregarProductos } = useContext(PedidoContext);

    // Consultar la base de datos
    const { data, loading } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        if (productos === null) {
            agregarProductos([]);
        } else {
            agregarProductos(productos);
        }
    }, [productos]);

    const seleccionarProductos = producto => {
        setProductos(producto)
    }

    if (loading) return null;

    const { obtenerProductos } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona los productos</p>
            <Select
                className="mt-3"
                options={obtenerProductos}
                onChange={opcion => seleccionarProductos(opcion)}
                isMulti={true}
                getOptionValue={opcion => opcion.id}
                getOptionLabel={opcion => `${opcion.nombre} - ${opcion.existencia} disponibles`}
                placeholder="Busca o selecciona uno o varios productos"
                noOptionsMessage={() => "No se encontro el cliente"}
            />
        </>
    );
}

export default AsignarProductos;