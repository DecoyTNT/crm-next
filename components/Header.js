import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario {
            id
            nombre
            apellido
            email
        }
    }
`;

const Header = () => {

    const { data, loading, error } = useQuery(OBTENER_USUARIO);

    const router = useRouter();

    // Esperar a que lleguen los datos
    if (loading) return null;

    if (error) return null;

    // Si no hay información
    if (!data.obtenerUsuario) {
        router.push('/login');
        return null;
    }

    const { nombre, apellido } = data.obtenerUsuario;

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <p className="mr-2 mb-3 lg:mb-0">Hola {nombre} {apellido}</p>
            <button
                onClick={cerrarSesion}
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs text-white rounded py-1 px-2 shadow-md hover:bg-blue-900"
                type="button"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Header;