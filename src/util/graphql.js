import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
})

const SERVICE = '/graphql';

const stripIgnoredCharacters = operationString => operationString
  .replace(/[\r\n,]/g, '')
  .replace(/\s*([{}:$])\s*/g, '$1')
  .replace(/\s{2,}/g, ' ');

export default {
    performOperation(operation, variables = {}) {
        // console.log(`Running operation: ${operation}\n With variables: ${JSON.stringify(variables)}`)
        const query = stripIgnoredCharacters(operation);
        const data = {
            query,
            variables,
        };
        return api.post(SERVICE, data);
    },
};