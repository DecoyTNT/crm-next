import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'https://crm-graphql-jm.herokuapp.com/',
    fetch
});

const authLink = setContext((_, { headers }) => {

    // obtener token del localStorage
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;