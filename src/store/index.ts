import { heyLoader } from "@/mixin/hey";
import ky from "ky";
import { createStore } from "vuex";

export default createStore({
  state: {
    program: '; example\ndef greetings r(70 "Hello world" green)\ngreetings',
    output: undefined,
    error: undefined,
  },
  getters: {
    hey() {
      return heyLoader(() => ky("/hey.ohm").text());
    },
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
    async exec({ state, commit, getters }) {
      const hey = await getters.hey;
      try {
        const output = hey(state.program);
        commit("setOutput", output);
        commit("setError", undefined);
      } catch (error) {
        commit("setError", error);
      }
    },
  },
  modules: {},
});
