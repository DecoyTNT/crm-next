import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!){
        obtenerCliente(id: $id) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

const ACTULIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input){
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

const EditarCliente = () => {

    // Obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // Consultar cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Actualizar cliente
    const [actualizarCliente] = useMutation(ACTULIZAR_CLIENTE);

    // Schema de validación
    const schemaValidacion = Yup.object().shape({
        nombre: Yup.string()
            .required('El nombre del cliente es obligatorio'),
        apellido: Yup.string()
            .required('El apellido del cliente es obligatorio'),
        empresa: Yup.string()
            .required('La empresa del cliente es obligatoria'),
        email: Yup.string()
            .email('El email no es válido')
            .required('El email del cliente es obligatorio'),
    });

    if (loading) {
        return (<div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
            </Layout>
        </div>)
    }

    const { obtenerCliente } = data;

    // Modificar cliente en la bd
    const modificarCliente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
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
                'Actualizado',
                `El cliente ${data.actualizarCliente.nombre} se actualizo correctamente`,
                'success'
            )

            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        enableReinitialize
                        initialValues={obtenerCliente}
                        validationSchema={schemaValidacion}
                        validateOnChange={false}
                        onSubmit={valores => {
                            modificarCliente(valores);
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    {props.errors.nombre || props.errors.apellido || props.errors.email || props.errors.password
                                        ?
                                        <div className="my-2 bg-red-100 border-4 border-red-500 text-red-700 p-4 text-center">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                            <p>{props.errors.apellido}</p>
                                            <p>{props.errors.empresa}</p>
                                            <p>{props.errors.email}</p>
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
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
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
                                            value={props.values.apellido}
                                            onChange={props.handleChange}
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
                                            value={props.values.empresa}
                                            onChange={props.handleChange}
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
                                            value={props.values.email}
                                            onChange={props.handleChange}
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
                                            value={props.values.telefono}
                                            onChange={props.handleChange}
                                        />
                                    </div>
                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white font-bold uppercase rounded hover:bg-gray-900"
                                        type="submit"
                                        value="Editar cliente"
                                    />
                                </form>
                            )
                        }}

                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarCliente;