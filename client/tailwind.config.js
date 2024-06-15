/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      colors: {
        primary: "#FDD100", 
        secondary: "#00DD9C", 
        tertiary:"#3A2D3F"
      
      },
      fontFamily : { 
       poppins : ['Poppins'],
        figtree : ['Figtree'], 
        jaro : ['Jaro'],
      },
      backgroundImage:{
        hero2 : "url('./src/User/img/doodle_finaldraft.png')",
      } 
      
    },
  },
  plugins: [require('daisyui')],
}