import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><p>Hello world</p>");

globalThis.document = dom.window.document;
globalThis.window = dom.window as unknown as Window & typeof globalThis;
