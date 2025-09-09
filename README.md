# SEPTA API Wrapper
SEPTAs official APIs can be quite a pain to work with, and many functions are not documented.  
This project aims to improve the APIs usability by wrapping the official API with a consolidated easy to use and well documented API.

> **Note**: This project is still a work in progress!

## Getting Started
1. Clone the repository:
   `git clone https://github.com/kevinsal03/septa-wrapper.git`
2. Install dependencies:
    - Install Node v22
    - Install pnpm
    - Run `pnpm install` to install project dependencies
3. Copy `sample.env` to `.env` and configure any options.
   - *Nearly all options have defaults, but I still recommend copying this file*
4. Boot the development server
   `pnpm run dev` to install the TypeSpec compiler and compile the included Typespec file to OpenAPI YAML
5. Access the Swagger UI shipped as part of the project at: `http://localhost:3000/docs`
6. Try it out!

The full spec is published at `http://localhost:3000/docs/api.openapi.yml` or `spec/tsp-output/schema/openapi.yaml`.

> This project is still very much under development and is only a test version. Do not expect the current version to be a polished product.


## CORS and CORP
Modify these options in your `.env`. They are provided by default as `localhost,127.0.0.1`.  
**This is not production ready yet!**