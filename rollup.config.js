import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
  //入口
  input: "./src/index.js",
  //出口
  output: {
    file: "dist/umd/vue.js",
    name: "Vue",
    format: "umd",
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: "/public/index.html",
      port: 3333,
      contentBase: ""
    }) : null
  ]
}
