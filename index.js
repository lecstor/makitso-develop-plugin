"use strict";

const chalk = require("chalk");

function setValue(context, prop, value) {
  context.debug && console.log(context, prop, value);
  return context.set(prop, value);
}

function getValue(context, prop) {
  return context.get(prop).then(console.log);
}

const commands = {
  set: {
    args: "prop value",
    description: "Set a context value",
    action: setValue
  },
  get: {
    args: "prop",
    description: "Get a context value",
    action: getValue
  },
  dump: {
    store: {
      args: "storeId",
      description: "Dump the store",
      choices: {
        storeId: ({ context }) => context.listStores()
      },
      action: async (context, { storeId }) => {
        const store = await context.getStore(storeId);
        console.log(JSON.stringify(await store.read(), null, 2));
      }
    },
    schema: {
      description: "Dump the schema",
      action: async context => {
        console.log(JSON.stringify(context.getSchema(), null, 2));
      }
    }
  },
  debug: {
    on: {
      description: "Turn on debugging",
      action: async context => {
        context.debug = true;
        console.log("Debug On");
      }
    },
    off: {
      description: "Turn off debugging",
      action: async context => {
        context.debug = false;
        console.log("Debug Off");
      }
    }
  },
  test: {
    validation: {
      args: "required [optional]",
      action: async (context, args) => {
        console.log(`dev test`, { args });
        if (!args.required) {
          console.log(chalk.red("Failed: No required arg"));
        }
      }
    },
    completion: {
      abcdefg: {
        action: async () => console.log("abcdefg!!")
      },
      abcdefghij: {
        action: async () => console.log("abcdefghij!!")
      },
      abcdefghijklm: {
        action: async () => console.log("abcdefghijklm!!")
      },
      abcabc: {
        action: async () => console.log("abcabc!!")
      }
    }
  }
};

const config = {
  command: "dev"
};

/**
 * get the plugin configuration
 * @returns {Object} config - plugin config
 */
function plugin() {
  return { commands, config };
}

module.exports.plugin = plugin;
