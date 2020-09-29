import React from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id: $id)
    }
`;

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

const Cliente = ({ cliente }) => {

    const { nombre, apellido, empresa, email, id } = cliente;

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            // Obtener el objeto de cache que se actualizara
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO
            });

            // Reescribir el cache ( el cache nunca se debe de modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(clienteActual => clienteActual.id !== id)
                }
            })
        }
    });

    const confirmarEliminarCliente = async () => {

        Swal.fire({
            title: '¿Seguro quieres eliminar este cliente?',
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
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }

            }
        })
    }

    const editarCliente = async () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">
                <button
                    onClick={confirmarEliminarCliente}
                    type="button"
                    className="flex justify-center items-center bg-red-800 px-4 py-2 rounded text-white w-full font-bold hover:bg-red-900"
                >
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    onClick={editarCliente}
                    type="button"
                    className="flex justify-center items-center bg-green-600 px-4 py-2 rounded text-white w-full font-bold hover:bg-green-700"
                >
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Cliente;