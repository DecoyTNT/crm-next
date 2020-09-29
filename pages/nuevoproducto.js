import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

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

const NuevoProducto = () => {

    const router = useRouter();

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            if (cache.data.data.ROOT_QUERY.obtenerProductos) {
                // Obtener el cache de los productos
                const { obtenerProductos } = cache.readQuery({
                    query: OBTENER_PRODUCTOS
                });

                // Reescribir el cache
                cache.writeQuery({
                    query: OBTENER_PRODUCTOS,
                    data: {
                        obtenerProductos: [...obtenerProductos, nuevoProducto]
                    }
                });
            }
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object().shape({
            nombre: Yup.string()
                .required('El nombre del producto es obligatorio'),
            existencia: Yup.number()
                .required('La cantidad del producto es obligatoria')
                .positive('La cantidad del producto debe ser un número positivo')
                .integer('La cantidad debe ser entera'),
            precio: Yup.number()
                .positive('El precio del producto debe ser un número positivo')
                .required('El precio del producto es obligatorio'),
        }),
        validateOnChange: false,
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                });

                Swal.fire(
                    'Registrado!',
                    `El producto ${data.nuevoProducto.nombre} se registro correctamente`,
                    'success'
                );

                router.push('/productos');
            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        {formik.errors.nombre || formik.errors.existencia || formik.errors.precio
                            ?
                            <div className="my-2 bg-red-100 border-4 border-red-500 text-red-700 p-4 text-center">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                                <p>{formik.errors.existencia}</p>
                                <p>{formik.errors.precio}</p>
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
                                placeholder="Nombre del producto"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                Cantidad disponible
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="existencia"
                                type="number"
                                placeholder="Cantidad disponible"
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                Precio
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="Precio del producto"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                            />
                        </div>

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white font-bold uppercase rounded hover:bg-gray-900"
                            type="submit"
                            value="Agregar Nuevo Producto"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoProducto;