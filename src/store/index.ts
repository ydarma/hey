import hey from "@/composables/hey";
import { createStore } from "vuex";

export default createStore({
  state: {
    program: '; example\ndef greetings r(70 "Hello world" green)\ngreetings',
    output: undefined,
    error: undefined,
  },
  mutations: {
    setProgram(state, program) {
      state.program = program;
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
        const output = await hey(state.program);
        commit("setOutput", output);
        commit("setError", undefined);
      } catch (error) {
        commit("setError", error);
      }
    },
  },
  modules: {},
});
