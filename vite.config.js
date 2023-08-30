import { defineConfig } from 'vite'
    
export default defineConfig({
  css: {
	preprocessorOptions: {
	  scss: {
		// additionalData: `
		//   @import "./scss/main.scss";
		// `
	  }
	}
  }
})