import { hey, cancel } from "@/libs/hey";
import { createStore } from "vuex";

export default createStore({
  state: {
    program: undefined,
    output: undefined,
    error: undefined,
  },
  mutations: {
    setProgram(state, program) {
      state.program = program;
      state.error = undefined;
      state.output = undefined;
    },
    setOutput(state, output) {
      state.output = output;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async exec({ state, commit }) {
      try {
        commit("setError", undefined);
        const output = await hey(state.program ?? "");
        commit("setOutput", output);
      } catch (error) {
        commit("setError", error);
      }
    },
    async clear({ commit }) {
      cancel();
      commit("setOutput", undefined);
      commit("setError", undefined);
    },
  },
  modules: {},
});
