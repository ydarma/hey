import { hey } from "@/libs/hey";
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
        const output = await hey(state.program ?? "");
        commit("setOutput", output);
        commit("setError", undefined);
      } catch (error) {
        commit("setError", error);
      }
    },
    async clear({ commit }) {
      commit("setOutput", undefined);
      commit("setError", undefined);
    },
  },
  modules: {},
});
