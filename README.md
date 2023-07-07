## 🌺 [pretty-roact-hooks](https://npmjs.com/package/@rbxts/pretty-roact-hooks)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/littensy/pretty-roact-hooks/ci.yml?branch=master&style=for-the-badge&logo=github)
[![npm version](https://img.shields.io/npm/v/@rbxts/pretty-roact-hooks.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/pretty-roact-hooks)
[![npm downloads](https://img.shields.io/npm/dt/@rbxts/pretty-roact-hooks.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/pretty-roact-hooks)
[![GitHub license](https://img.shields.io/github/license/littensy/pretty-roact-hooks?style=for-the-badge)](LICENSE.md)

An opinionated collection of useful hooks and utilites for Roblox-TS and [Roact Hooked](https://github.com/littensy/rbxts-roact-hooked/).

Every hook has documentation and tests. If you find a bug or have a feature request, please [open an issue](https://github.com/littensy/pretty-roact-hooks/issues/new/).

&nbsp;

## ⭐ Featured

Check out some featured hooks:

-   [🦾 `useMotor`](src/use-motor/) - Creates a motor and returns a binding, a function to set the goal, and a motor API
-   [⏱️ `useAsync`](src/use-async/) - A hook that runs an async function and returns the result and status
-   [⚙️ `useProperty`](src/use-property/) - Tracks the state of one or more instance properties without refs

This package also exports some useful utilities:

-   [🧪 `renderHook`](src/utils/testez.tsx) - Render a hook in a test environment
-   [📕 `hoarcekat`](src/utils/hoarcekat.tsx) - Create a Hoarcekat story with hook detection
-   [📦 `binding utils`](src/utils/binding.ts) - Work with values that may or may not be bindings

Or, see the [full list of hooks](src/).

&nbsp;

## 📦 Installation

This package is available for Roblox TypeScript projects on [NPM](https://www.npmjs.com/package/@rbxts/pretty-roact-hooks).

```sh
npm install @rbxts/pretty-roact-hooks @rbxts/flipper @rbxts/roact
```

or

```sh
pnpm add @rbxts/pretty-roact-hooks @rbxts/flipper @rbxts/roact
```

&nbsp;

## 🌻 Contributing

Contributions are welcome! Note that if you make a change to a hook, you should also check the tests and documentation.

To get started, clone the repository and run `npm install` or `pnpm install`. Then, you can run the following commands:

-   `pnpm dev` - Enable watch mode with the `game` project type
-   `pnpm build` - Build the package

You will likely need the following extensions:

-   [Rojo VSCode extension](https://marketplace.visualstudio.com/items?itemName=evaera.vscode-rojo)
-   [TestEZ Companion](https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion)

&nbsp;

## 📝 License

pretty-roact-hooks is licensed under the [MIT License](LICENSE.md).
