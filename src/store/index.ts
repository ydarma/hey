import hey from "@/libs/hey";
import { createStore } from "vuex";

export default createStore({
  state: {
    program: undefined,
    output: undefined,
    error: undefined,
    chapter: "1. Introduction",
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
    setChapter(state, chapter) {
      state.chapter = chapter;
      state.program = undefined;
      state.error = undefined;
      state.output = undefined;
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
  },
  modules: {},
});
