## Local Tool Library Frontend

The frontend application for the Local Tool Library platform, enabling community members to easily browse, borrow, and share tools with their neighbors. Built with modern web technologies for a seamless user experience.

## Run

```sh
pnpm install
pnpm dev
```

We prefer `pnpm` as package manager. If you want to use `npm`, feel free to use it instead.


## Tech Stack

- [vite](https://vitejs.dev/)
- [react](https://reactjs.org/)
- [shadcn ui](https://ui.shadcn.com/)
- [react-i18next](https://github.com/i18next/react-i18next)
- [react-lucide](https://lucide.dev/)
- [transmart](https://github.com/Quilljou/transmart)
- [react-query](https://tanstack.com/query/latest/)
- [tailwindcss](https://tailwindcss.com/)
- [less](http://lesscss.org/)
- [postcss](https://postcss.org/)
- [react-router-dom](https://reactrouter.com/en/6.16.0)
- [eslint](https://eslint.org/)/[stylelint](https://stylelint.io/)
- [prettier](https://prettier.io/)
- [svgr](https://react-svgr.com/)
- [editorconfig](https://editorconfig.org/)
- [husky](https://typicode.github.io/husky/#/)/[lint-staged](https://github.com/okonet/lint-staged)
- [commitlint](https://commitlint.js.org/)


## Project Structure

```sh
src
├── app.tsx     # App entry
├── assets      # Assets for images, favicon etc
├── components  # React components
├── hooks       # React hooks
├── i18n        # i18n files
├── lib         # Utils、tools、services
├── main.tsx    # File entry
├── pages       # One .tsx per page
├── router.tsx  # Routers
├── styles      # Less files
├── types       # Typescript types
└── vite-env.d.ts
```
