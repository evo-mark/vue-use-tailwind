import { createApp } from "vue";
import { createVuetify } from "vuetify";
import colours from "vuetify/util/colors";
import App from "./App.vue";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import "./css/index.css";
import "vuetify/styles";

const app = createApp(App);
const vuetify = createVuetify({
	icons: {
		defaultSet: "mdi",
		aliases,
		sets: {
			mdi,
		},
	},
	theme: {
		themes: {
			light: {
				colors: {
					primary: colours.teal.darken1,
				},
			},
		},
	},
});

app.use(vuetify).mount("#app");
