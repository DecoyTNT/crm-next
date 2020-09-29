import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import shortid from 'shortid';

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput ) {
        actualizarPedido(id: $id, input: $input) {
            estado
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id) 
    }
`;

const OBTENER_PEDIDOS_VENDEDOR = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor {
            id
        }
    }
`;

const OBTENER_PEDIDO = gql`
    query obtenerPedido($id: ID!){
        obtenerPedido(id: $id){
            id
            pedido {
                producto
                cantidad
                nombre
                totalProducto
            }
            total
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            estado
            creado
        }
    }
`;

const Pedido = ({ pedido }) => {

    const { id, total, estado, cliente } = pedido;

    const { data, loading } = useQuery(OBTENER_PEDIDO, {
        variables: {
            id
        }
    });

    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS_VENDEDOR
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS_VENDEDOR,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(pedido => pedido.id !== id)
                }
            })
        }
    });

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if (estadoPedido) {
            setEstadoPedido(estadoPedido);
        }
        cambiarColor();
    }, [estadoPedido]);

    // Funcion para cambiar el color del pedido, segun su estado
    const cambiarColor = () => {
        switch (estadoPedido) {
            case 'Pendiente':
                setClase('border-yellow-500');
                break;

            case 'Completado':
                setClase('border-green-500');
                break;

            case 'Cancelado':
                setClase('border-red-500');
                break;

            default:
                setClase('border-yellow-500');
                break;
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        cliente: cliente.id,
                        estado: nuevoEstado
                    }
                }
            });

            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error);
        }
    }

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: '¿Seguro quieres eliminar este pedido?',
            text: "Una vez eliminado, no se podra recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.value) {
                try {

                    const { data } = await eliminarPedido({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarPedido,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    if (loading) {
        return (<div>
            <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
        </div>)
    }

    return (
        <div className={`${clase} border-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">Cliente: {data.obtenerPedido.cliente.nombre} {data.obtenerPedido.cliente.apellido}</p>
                {data.obtenerPedido.cliente.email && (
                    <p className="flex items-center my-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {data.obtenerPedido.cliente.email}
                    </p>
                )}
                {data.obtenerPedido.cliente.telefono && (
                    <p className="flex items-center my-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {data.obtenerPedido.cliente.telefono}
                    </p>
                )}

                <h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>
                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-700 focus:border-blue-700 uppercase text-xs font-bold hover:bg-blue-700"
                    value={estadoPedido}
                    onChange={e => cambiarEstadoPedido(e.target.value)}
                >
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
                {data.obtenerPedido.pedido.map(producto => (
                    <div key={shortid.generate()} className="mt-4">
                        <p className="text-sm text-gray-600">Producto: {producto.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                    </div>
                ))}

                <p className="text-gray-800 mt-3 font-bold">
                    Total a pagar:
                    <span className="font-light">
                        $ {total}
                    </span>
                </p>

                <button
                    className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold hover:bg-red-900"
                    onClick={confirmarEliminarPedido}
                >
                    Eliminar Pedido
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Pedido;