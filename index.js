const externalIP = require('external-ip')();
require('dotenv').config();
const fs = require('fs');

const cpanel = require('./cpanel');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { AUTH_USERNAME, AUTH_PASSWORD, DOMAIN, DOMAINS_FILE } = process.env;

const getDomainNames = () => {
  const domainNamesContent = fs.readFileSync(DOMAINS_FILE, {
    encoding: 'utf8'
  });

  return JSON.parse(domainNamesContent);
};

const getExternalIp = () => {
  return new Promise((res, rej) => {
    externalIP((err, ip) => {
      if (err) {
        rej(err);
      }

      console.log(`External Ip: ${ip}`);

      res(ip);
    });
  });
};

const find = records => {
  return domainName => {
    return records.find(f => f.name === `${domainName}.`);
  };
};

(async () => {
  try {
    const domainNames = getDomainNames();

    if (!domainNames || domainNames.length === 0) {
      console.log('No domains to update');
      return;
    }

    const publicIp = getExternalIp();

    const cpanelApi = cpanel(AUTH_USERNAME, AUTH_PASSWORD, DOMAIN);

    const records = await cpanelApi.fetchRecords();

    const findRecord = find(records);

    const domainRecords = domainNames.map(m => {
      return { domain: m, record: findRecord(m) };
    });

    console.log(domainRecords);

    domainRecords.filter(f => f.record).forEach(f => {
      console.log(`Updating domain: ${f.domain} in line: ${f.record.line}`);
      // await cpanelApi.updateRecord(f.record.line, publicIp);
    });

    // await cpanelApi.updateRecord();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
