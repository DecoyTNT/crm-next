import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
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

const NuevoCliente = () => {

    const router = useRouter();

    const [mensaje, setMensaje] = useState(null);

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            if (cache.data.data.ROOT_QUERY.obtenerClientesVendedor) {
                // Obtener el objeto de cache que se actualizara
                const { obtenerClientesVendedor } = cache.readQuery({
                    query: OBTENER_CLIENTES_USUARIO
                });

                // Reescribir el cache ( el cache nunca se debe de modificar)
                cache.writeQuery({
                    query: OBTENER_CLIENTES_USUARIO,
                    data: {
                        obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                    }
                });
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object().shape({
            nombre: Yup.string()
                .required('El nombre del cliente es obligatorio'),
            apellido: Yup.string()
                .required('El apellido del cliente es obligatorio'),
            empresa: Yup.string()
                .required('La empresa del cliente es obligatoria'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email del cliente es obligatorio'),
        }),
        validateOnChange: false,
        onSubmit: async valores => {
            const { nombre, apellido, empresa, email, telefono } = valores;

            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });

                Swal.fire(
                    'Registrado!',
                    `El cliente ${data.nuevoCliente.nombre} se registro correctamente`,
                    'success'
                );

                router.push('/');

            } catch (error) {
                console.log(error);
                setMensaje(error.message.replace('Error: ', ''));

                setTimeout(() => {
                    setMensaje(null);
                }, 3000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        {formik.errors.nombre || formik.errors.apellido || formik.errors.email || formik.errors.password
                            ?
                            <div className="my-2 bg-red-100 border-4 border-red-500 text-red-700 p-4 text-center">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                                <p>{formik.errors.apellido}</p>
                                <p>{formik.errors.empresa}</p>
                                <p>{formik.errors.email}</p>
                            </div>
                            : null
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre del cliente"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                Apellido
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="apellido"
                                type="text"
                                placeholder="Apellido del cliente"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                Empresa
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="empresa"
                                type="text"
                                placeholder="Empresa del cliente"
                                value={formik.values.empresa}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email de usuario"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                Teléfono
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="telefono"
                                type="tel"
                                placeholder="Teléfono de usuario"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white font-bold uppercase rounded hover:bg-gray-900"
                            type="submit"
                            value="Registrar cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;