import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {

    const router = useRouter();

    const { client, data, loading, error } = useQuery(OBTENER_USUARIO);

    // Esperar a que lleguen los datos
    if (loading) return null;

    if (error) return null;

    // Si no hay información
    if (!data) {
        router.push('/login');
        client.resetStore();
        return null;
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className="sm:flex sm:justify-between mb-6">
            {data.obtenerUsuario && (
                <p className="mr-2 mb-3 lg:mb-0">Hola {data.obtenerUsuario.nombre} {data.obtenerUsuario.apellido}</p>
            )}
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