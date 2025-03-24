import fs from 'fs';
import { parse } from 'csv-parse';
import { NodeSSH } from 'node-ssh';
import { exit, argv } from 'node:process'
import { basename } from 'path';

if (argv.length != 3) {
  console.log(`usage ${basename(argv[1])} <workshop.csv>`);
  exit(1);
}

const parser = parse({delimiter: ',', from_line: 2}, function(err, data){
  data.forEach(async (row) => {
    const key = row[8];
    const ip = row[10];
    const port = row[11];
    const user = row[12];

    console.log(`key: ${ip}, port: ${port}, user: ${user}`);
    const ssh = new NodeSSH();

    await ssh.connect({
      host: ip,
      username: user,
      port: Number.parseInt(port),
      privateKey: key,
      readyTimeout: 200000
    });

    console.log(`connected host: ${ip}`);
    //await ssh.execCommand("docker stop $(docker ps -a -q)");
    //await ssh.execCommand("docker rm $(docker ps -a -q)");
    await ssh.execCommand("cd presto-iceberg-lab/conf && docker compose down -v");
    console.log('stopped and removed all containers');

    ssh.dispose();
  });
});


fs.createReadStream(argv[2]).pipe(parser);

