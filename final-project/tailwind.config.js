
// const flowbite = require("flowbite-react/tailwind");
// /** @type {import('tailwindcss').Config} */
// module.exports =  {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     flowbite.content(),
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     flowbite.plugin(),
//   ],
// };
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(), // Flowbite content integration
  ],
  theme: {
    extend: {
      fontFamily: {
        jacques: ['Jacques Francois', 'serif'], // Add Jacques Francois font here
      },
    },
  },
  plugins: [
    flowbite.plugin(), // Flowbite plugin integration
  ],
};
