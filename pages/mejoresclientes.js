import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { gql, useQuery } from '@apollo/client';

const MEJORES_CLIENTES = gql`
    query mejoresClientes{
        mejoresClientes {
            cliente {
                nombre
            }
            total
        }
    }
`;

const MejoresClientes = () => {

    const { data, loading, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if (loading) {
        return (<div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
            </Layout>
        </div>)
    }

    const { mejoresClientes } = data;

    const clienteGrafica = [];

    mejoresClientes.map((cliente, index) => {
        console.log(cliente);
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        }
        console.log(clienteGrafica[index]);
    })


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={900}
                    height={500}
                    data={clienteGrafica}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />

                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
}

export default MejoresClientes;