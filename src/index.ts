import { mountGlobalVariables } from "./utils/index";
import AutomationCreateVueroutePlugin from "./core/index";
import { T_AutomationCreateVueroutePlugin_options } from "./types";
export default {
  name: "automation-create-vueRoute-plugin",
  install(vue, options: T_AutomationCreateVueroutePlugin_options) {
    const instance = new AutomationCreateVueroutePlugin(options);
    mountGlobalVariables(vue, instance);
  },
};
