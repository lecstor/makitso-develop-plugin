"use strict";

const _includes = require("lodash/includes");
const chalk = require("chalk");

function setValue({ context, input }) {
  const { prop, value } = input.args;
  context.debug && console.log(context, prop, value);
  return context.set(prop, value);
}

function getValue({ context, args }) {
  const { prop } = args;
  return context.get(prop).then(console.log);
}

const commands = {
  dev: {
    commands: {
      set: {
        arguments: [
          "prop - the name of the context property to set",
          "value - the value to set on the property"
        ],
        description: "Set a context value",
        action: setValue
      },
      get: {
        arguments: ["prop - the name of the context property to get"],
        description: "Get a context value",
        action: getValue
      },
      dump: {
        store: {
          arguments: ["id - the store identifier"],
          description: "Dump the store",
          suggest: ({ context, input }) => {
            const stores = context.listStores();
            if (!(input.args.id && _includes(stores, input.args.id))) {
              return context.listStores();
            }
            return [];
          },
          action: async ({ context, input }) => {
            const { id } = input.args;
            const store = await context.getStore(id);
            console.log(JSON.stringify(await store.read(), null, 2));
          }
        },
        schema: {
          description: "Dump the schema",
          action: async ({ context }) => {
            console.log(JSON.stringify(context.getSchema(), null, 2));
          }
        }
      },
      debug: {
        on: {
          description: "Turn on debugging",
          action: async ({ context }) => {
            context.debug = true;
            console.log("Debug On");
          }
        },
        off: {
          description: "Turn off debugging",
          action: async ({ context }) => {
            context.debug = false;
            console.log("Debug Off");
          }
        }
      },
      test: {
        validation: {
          arguments: ["required - required arg", "[optional] - optional arg"],
          action: async ({ context, input }) => {
            console.log(`dev test`, { input });
            if (!input.args.required) {
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
        },
        error: {
          action: () => {
            throw new Error("Kaboom!");
          }
        }
      }
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
