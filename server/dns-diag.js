const { Resolver } = require('node:dns').promises;
const fs = require('node:fs');
const resolver = new Resolver();
resolver.setServers(['8.8.8.8']);

async function diagnose() {
    const hostname = '_mongodb._tcp.cluster0.m9ephgo.mongodb.net';
    const mongoUser = 'internxindia';
    const mongoPass = 'internx123';
    const dbName = 'psyx';

    let output = `Resolving SRV for: ${hostname} using 8.8.8.8\n`;
    try {
        const srvRecords = await resolver.resolveSrv(hostname);
        output += '✅ SRV Records found.\n';

        const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
        const standardUrl = `mongodb://${mongoUser}:${mongoPass}@${hosts}/${dbName}?ssl=true&replicaSet=atlas-m9ephgo-shard-0&authSource=admin&retryWrites=true&w=majority`;

        output += '\n--- Standard Connection String (Fallback) ---\n';
        output += standardUrl + '\n';
        output += '---------------------------------------------\n';

    } catch (err) {
        output += `❌ SRV Resolution Error: ${err.message}\n`;
    }

    fs.writeFileSync('dns-results-utf8.txt', output, 'utf8');
    console.log('Results written to dns-results-utf8.txt');
}

diagnose();
