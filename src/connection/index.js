import * as google from "./google";
import * as mongo from "./mongo";
import * as discord from "./discord";

import { Logger } from "../tool";
import { async } from "../util";
const { sleep } = async;

const logger = new Logger(`ConnectionManager`);

const modules = {
  mongo,
  discord,
};

const connections = Object.values(modules).map(m => m.connection);

const moduleNames = [];
for (const name of Object.keys(modules)) {
  moduleNames.push(name);
}

logger.info(`Registered modules: ${moduleNames.join(`, `)}`);

const openConnections = (async (selection) => {
  selection ??= Object.keys(modules);
  if (!Array.isArray(selection)) {
    throw new Error(`Expected array, got ${typeof selection}`, selection);
  }
  logger.info(`Awaiting for module initialization...` + (selection ? ` [${selection.join(`, `)}]` : ``));
  const initializations = Object.entries(modules).filter(v => selection.includes(v[0])).map(v => v[1]).map(c => c.connection.init());
  await Promise.any([sleep(10000), Promise.allSettled(initializations)]);
  const reports = [];
  const WIDTH = 20;
  for (const connection of connections) {
    reports.push(`➣ [${connection.name}]`.padEnd(WIDTH) + (!connection.isNull() ? `: ${connection.isOperational() ? `✔️ ` : `❌ `} ${connection.state}` : `⚠️  ${connection.rejectReason}`));
  }
  logger.info(
    `== Open Connection Report ==\n` +
    `Module name`.padEnd(WIDTH) + `  Status\n` +
    reports.join(`\n`));
});

async function closeConnections() {
  return await Promise.all(connections.map(c => c.close()));
}

export { mongo, discord, openConnections, closeConnections };
