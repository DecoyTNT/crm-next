import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from './../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';
import PedidoContext from '../context/pedidos/PedidoContext';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
        nuevoPedido(input: $input){
            id
        }
    }
`;

const OBTENER_PEDIDOS_VENDEDOR = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor {
            id
            pedido {
                producto
                cantidad
                nombre
                totalProducto
            }
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`;

const NuevoPedido = () => {

    const router = useRouter();

    // Context de pedidos
    const { cliente, productos, total } = useContext(PedidoContext);

    const [mensaje, setMensaje] = useState(null);

    // Mutation para crear un nuevo pedido
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {
            if (cache.data.data.ROOT_QUERY.obtenerPedidosVendedor) {
                // Obtener el objeto de cache que se actuaalizara
                const { obtenerPedidosVendedor } = cache.readQuery({
                    query: OBTENER_PEDIDOS_VENDEDOR
                });

                // Reescribir el cache
                cache.writeQuery({
                    query: OBTENER_PEDIDOS_VENDEDOR,
                    data: {
                        obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                    }
                })
            }
        }
    })

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || Object.keys(cliente).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
    }

    const crearNuevoPedido = async () => {

        try {
            if (!productos.every(producto => producto.cantidad > 0) || total === 0 || Object.keys(cliente).length === 0) {
                return;
            }

            // Remover de productos lo que no se ocupa
            // const pedido = productos.map(({ id, existencia, __typename, ...prod }) => prod);
            const pedido = productos.map(({ id, existencia, __typename, ...prod }) => {

                let nuevoProducto = { ...prod, producto: id };
                return nuevoProducto
            });

            await nuevoPedido({
                variables: {
                    input: {
                        cliente: cliente.id,
                        pedido,
                        total,
                        estado: 'Pendiente'
                    }
                }
            });

            router.push('/pedidos');

            Swal.fire(
                'Registrado!',
                `El pedido fue registrado correctamente`,
                'success'
            );

        } catch (error) {
            setMensaje(error.message.replace('Error: ', ''));
            console.log(error);

            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <AsignarCliente />

                    <AsignarProductos />

                    <ResumenPedido />

                    <Total />

                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold rounded hover:bg-gray-900 ${validarPedido()}`}
                        onClick={crearNuevoPedido}
                    >
                        Registrar pedido
                    </button>

                </div>
            </div>

        </Layout>
    );
}

export default NuevoPedido;