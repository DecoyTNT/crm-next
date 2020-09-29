import React from 'react';
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import Producto from './../components/Producto';
import Link from 'next/link';

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

const Productos = () => {

    const { data, loading } = useQuery(OBTENER_PRODUCTOS);

    if (loading) {
        return (<div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
            </Layout>
        </div>)
    }


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

            <Link href="/nuevoproducto">
                <a className="bg-blue-800 py-2 px-5 my-3 inline-block rounded text-white text-sm font-bold uppercase hover:bg-blue-900 w-full sm:w-auto text-center">Nuevo Producto</a>
            </Link>
            <div className="overflow-x-scroll">
                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                        <tr className="text-white">
                            <th className="w-1/5 py-2">Nombre</th>
                            <th className="w-1/5 py-2">Existencia</th>
                            <th className="w-1/5 py-2">Precio</th>
                            <th className="w-1/5 py-2">Eliminar</th>
                            <th className="w-1/5 py-2">Editar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.obtenerProductos.map(producto => (
                            <Producto
                                key={producto.id}
                                producto={producto}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Productos;