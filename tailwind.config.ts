import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {},
	plugins: [animate],
};

export default config;
