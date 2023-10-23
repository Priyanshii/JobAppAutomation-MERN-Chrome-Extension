const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: path.join(__dirname, 'src', 'background', 'index.js'),
    content: path.join(__dirname, 'src', 'content', 'index.js'),
    content_script_job_link: path.join(__dirname, 'src', 'content', 'content_script_job_link.js'),
    content_script_job_submit: path.join(__dirname, 'src', 'content', 'content_script_job_submit.js'),
    content_script_job_application_form: path.join(__dirname, 'src', 'content', 'content_script_job_application_form.js'),
    popup: path.join(__dirname, 'src', 'popup', 'popup.js'),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/, // Change the test extension to .js
        use: [
          {
            loader: "babel-loader", // Use Babel for JavaScript
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
      new HTMLPlugin({
        template: path.join(__dirname, 'src', 'popup', 'popup.html'), // Path to your HTML template
        filename: 'popup.html', // Output filename for the generated HTML
        chunks: ['popup'], // Specify which entry point (chunk) to include
        cache: false, // Disable caching for the generated HTML
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets/icon-128.png',
            to: path.join(__dirname, 'dist'),
            force: true,
          },
        ],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/index.css',
            to: path.join(__dirname, 'dist'),
            force: true,
          },
        ],
      }),
    new CopyPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: path.join(__dirname, 'dist'),  
          force: true,    
        }
      ],
    }),
    ...getHtmlPlugins(["index"]),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'], // Remove .tsx and .ts extensions
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}