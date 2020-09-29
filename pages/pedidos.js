import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Pedido from '../components/Pedido';
import shortid from 'shortid';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
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

const Pedidos = () => {

    const { data, loading } = useQuery(OBTENER_PEDIDOS);

    if (loading) {
        return (<div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
            </Layout>
        </div>)
    }
    const { obtenerPedidosVendedor } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>

            <Link href="/nuevopedido">
                <a className="bg-blue-800 py-2 px-5 my-3 inline-block rounded text-white text-sm font-bold uppercase hover:bg-blue-900 w-full sm:w-auto text-center">Nuevo Pedido</a>
            </Link>

            {obtenerPedidosVendedor.length === 0
                ?
                <p className="mt-5 text-center text-2xl">No hay pedidos</p>
                :
                obtenerPedidosVendedor.map(pedido => (
                    <Pedido
                        key={shortid.generate()}
                        pedido={pedido}
                    />
                ))
            }
        </Layout>
    );
}

export default Pedidos;