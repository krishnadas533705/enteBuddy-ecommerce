/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily : { 
       poppins : ['Poppins'],
        figtree : ['Figtree'], 
        jaro : ['Jaro'],
      },
      backgroundImage:{
        hero : "url('./src/User/img/peakpx.jpg')", 
      } 
     
    },
  },
  plugins: [require('daisyui')],
}