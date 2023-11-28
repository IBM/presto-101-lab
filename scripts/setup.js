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
      privateKey: key
    });

    console.log(`connected host: ${ip}`);
    // Local, Remote
    await ssh.putFiles([
      { local: 'docker-install.sh', remote: 'docker-install.sh'},
      { local: 'docker-images.sh', remote: 'docker-images.sh'}
    ]);

    console.log("files uploaded");
    await ssh.execCommand("chmod +x docker-install.sh");
    console.log('chmod docker-install.sh done');
    await ssh.execCommand("chmod +x docker-images.sh");
    console.log('chmod docker-images.sh done');
    await ssh.execCommand("./docker-install.sh");
    console.log('docker-install.sh done');
    ssh.dispose();

    //connect again and pull images
    await ssh.connect({
      host: ip,
      username: user,
      port: Number.parseInt(port),
      privateKey: key
    });
    await ssh.execCommand("docker-images.sh");
    console.log('pull images done');
    ssh.dispose();
  });
});


fs.createReadStream(argv[2]).pipe(parser);

