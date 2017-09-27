const request = require('request');

let username;
let password;
let domain;

const createBaseUrl = (username, domain) => {
  return `https://cpanel.tss.com.ar:2083/cpsess4476754846/json-api/cpanel?cpanel_jsonapi_user=${username}&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=ZoneEdit&domain=${domain}`;
};

const fetchRecords = () => {
  return new Promise((res, rej) => {
    const baseUrl = createBaseUrl(username, domain);
    const url = `${baseUrl}&cpanel_jsonapi_func=fetchzone_records`;

    request
      .get(url, (err, response, body) => {
        if (err) {
          rej(err);
        }

        console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);

        const json = JSON.parse(body);

        const { data } = json.cpanelresult;

        res(data);

        // const s = data
        //   .filter(f => f.address === '181.164.105.229')
        //   .map(m => m.name)
        //   .reduce((acc, cur) => {
        //     return `${acc},"${cur}"`;
        //   }, '');

        // console.log(s);
      })
      .auth(username, password, true);
  });
};

const updateRecord = (line, address) => {
  return new Promise((res, rej) => {
    const baseUrl = createBaseUrl(username, domain);
    const url = `${baseUrl}&cpanel_jsonapi_func=edit_zone_record&Line=${line}&address=${address}`;

    request
      .get(url, (err, response, body) => {
        if (err) {
          rej(err);
        }

        console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);

        const json = JSON.parse(body);

        const { data } = json.cpanelresult;

        res(data);

        // const s = data
        //   .filter(f => f.address === '181.164.105.229')
        //   .map(m => m.name)
        //   .reduce((acc, cur) => {
        //     return `${acc},"${cur}"`;
        //   }, '');

        // console.log(s);
      })
      .auth(username, password, true);
  });
};

const cpanel = (user, pass, baseDomain) => {
  username = user;
  password = pass;
  domain = baseDomain;

  return {
    fetchRecords,
    updateRecord
  };
};

module.exports = cpanel;