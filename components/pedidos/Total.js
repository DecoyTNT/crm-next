import React, { useContext } from 'react';
import PedidoContext from './../../context/pedidos/PedidoContext';

const Total = () => {

    const { total } = useContext(PedidoContext);

    return (
        <div className="flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-500 rounded">
            <div className="text-gray-800 text-lg">Total a pagar:</div>
            <p className="text-gray-800 mt-0">$ {total}</p>
        </div>
    );
}

export default Total;