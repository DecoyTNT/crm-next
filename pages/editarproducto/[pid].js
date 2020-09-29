import React from 'react';
import Layout from './../../components/Layout';
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import { gql, useQuery, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!){
        obtenerProducto(id:$id){
            id
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const EditarProducto = () => {

    const router = useRouter();
    const { query: { id } } = router;

    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    const schemaValidation = Yup.object().shape({
        nombre: Yup.string()
            .required('El nombre del producto es obligatorio'),
        existencia: Yup.number()
            .required('La cantidad del producto es obligatoria')
            .positive('La cantidad del producto debe ser un número positivo')
            .integer('La cantidad debe ser entera'),
        precio: Yup.number()
            .positive('El precio del producto debe ser un número positivo')
            .required('El precio del producto es obligatorio'),
    });

    if (loading) {
        return (<div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light text-center justify-center">Cargando...</h1>
            </Layout>
        </div>)
    }

    const { obtenerProducto } = data;

    const modificarProducto = async valores => {
        const { nombre, existencia, precio } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });

            Swal.fire(
                'Actualizado',
                `El producto ${data.actualizarProducto.nombre} se actualizo correctamente`,
                'success'
            );

            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        enableReinitialize
                        initialValues={obtenerProducto}
                        validationSchema={schemaValidation}
                        validateOnChange={false}
                        onSubmit={valores => {
                            modificarProducto(valores)
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    {props.errors.nombre || props.errors.existencia || props.errors.precio
                                        ?
                                        <div className="my-2 bg-red-100 border-4 border-red-500 text-red-700 p-4 text-center">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                            <p>{props.errors.existencia}</p>
                                            <p>{props.errors.precio}</p>
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
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
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
                                            value={props.values.existencia}
                                            onChange={props.handleChange}
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
                                            value={props.values.precio}
                                            onChange={props.handleChange}
                                        />
                                    </div>

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white font-bold uppercase rounded hover:bg-gray-900"
                                        type="submit"
                                        value="Editar Producto"
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

export default EditarProducto;