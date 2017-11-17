"use strict";

function setValue(context, prop, value) {
  context.debug && console.log(context, prop, value);
  return context.set(prop, value);
}

function getValue(context, prop) {
  return context.get(prop).then(console.log);
}

const commands = {
  set: {
    command: "set <prop> <value>",
    description: "Set a context value",
    action: setValue
  },
  get: {
    command: "get <prop>",
    description: "Get a context value",
    action: getValue
  },
  dumpStore: {
    command: "dumpStore <store>",
    description: "Dump the store",
    action: async (context, storeId) => {
      const store = await context.getStore(storeId);
      console.log(JSON.stringify(await store.read(), null, 2));
    }
  },
  dumpSchema: {
    command: "dumpSchema",
    description: "Dump the schema",
    action: async context => {
      console.log(JSON.stringify(context.getSchema(), null, 2));
    }
  },
  debugOn: {
    description: "Turn on debugging",
    action: async context => {
      context.debug = true;
      console.log("Debug On");
    }
  },
  debugOff: {
    description: "Turn off debugging",
    action: async context => {
      context.debug = false;
      console.log("Debug Off");
    }
  }
};

/**
 * get the plugin configuration
 * @returns {Object} config - plugin config
 */
function plugin() {
  return { commands };
}

module.exports.plugin = plugin;
