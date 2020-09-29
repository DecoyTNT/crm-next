import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
        }
    }
    
`;

const NuevaCuenta = () => {

    const [mensaje, setMensaje] = useState(null);

    // Mutation para crear un nuevo usuario
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

    const router = useRouter();

    // Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object().shape({
            nombre: Yup.string()
                .required('El nombre es obligatorio'),
            apellido: Yup.string()
                .required('El apellido es obligatorio'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            password: Yup.string()
                .required('El password es obligatorio')
                .min(6, 'El password debe ser al menos de 6 caracteres'),
        }),
        validateOnChange: false,
        onSubmit: async valores => {
            const { nombre, apellido, email, password } = valores;
            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });

                // Si se crea correctamente el usuario
                setMensaje(`El usuario: ${data.nuevoUsuario.nombre} se creo correctamente`);

                // Redirigir al login
                setTimeout(() => {
                    setMensaje(null);
                    router.push('/login');
                }, 3000);
            } catch (error) {
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
            {mensaje && mostrarMensaje()}
            <h1 className="text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form
                        className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        {formik.errors.nombre || formik.errors.apellido || formik.errors.email || formik.errors.password
                            ?
                            <div className="my-2 bg-red-100 border-4 border-red-500 text-red-700 p-4 text-center">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                                <p>{formik.errors.apellido}</p>
                                <p>{formik.errors.email}</p>
                                <p>{formik.errors.password}</p>
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
                                placeholder="Nombre del usuario"
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
                                placeholder="Apellido del usuario"
                                value={formik.values.apellido}
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
                                placeholder="Email del usuario"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Password del usuario"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase rounded hover:bg-gray-900"
                            type="submit"
                            value="Crear cuenta"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevaCuenta;