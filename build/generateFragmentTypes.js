/* eslint-disable no-console */
// @ts-nocheck
/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies */
require('dotenv-flow').config();
const fetch = require('node-fetch');
const fs = require('fs');

fetch(process.env.VUE_APP_GRAPHQL_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter((type) => type.possibleTypes !== null);
    // eslint-disable-next-line no-param-reassign
    result.data.__schema.types = filteredData;
    fs.writeFile('./src/apollo/fragmentTypes.json', JSON.stringify(result.data), (err) => {
      if (err) {
        console.error('Error writing fragmentTypes file', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  });
