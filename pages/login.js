import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {

    const [mensaje, setMensaje] = useState(null);

    // Mutation para hacer login
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            password: Yup.string()
                .required('El password es obligatorio')
        }),
        validateOnChange: false,
        onSubmit: async valores => {
            const { email, password } = valores;
            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });

                // Si se crea correctamente el usuario
                setMensaje('Se esta procesando la información');


                setTimeout(() => {
                    // Guardar el token en localStorage
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);
                }, 2000);
                setTimeout(() => {
                    // Redirigir al login
                    setMensaje(null);
                    router.push('/');
                }, 2000);

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
            <h1 className="text-center text-2xl text-white font-light">Login</h1>

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
                                <p>{formik.errors.email}</p>
                                <p>{formik.errors.password}</p>
                            </div>
                            : null
                        }
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Password de usuario"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase rounded hover:bg-gray-900"
                            type="submit"
                            value="Iniciar sesión"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Login;