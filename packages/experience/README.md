# @logto/experience

The register and sign-in experience for end-users.


## How to build

1. Clone repo:
```shell
git clone git@github.com:Zerve-AI/logto.git
cd logto
git fetch origin develop; git checkout develop
```
2. Install [pnpm](https://pnpm.io/installation)
3. Install dependencies
```shell
pnpm install --recursive
```
4. Build dependencies
```shell
  pnpm --filter "@logto/shared" run build && \
  pnpm --filter "@logto/connector-kit" --filter "@logto/core-kit" --filter "@logto/language-kit" run build && \
  pnpm --filter "@logto/phrases" --filter "@logto/phrases-experience" run build && \
  pnpm --filter "@logto/schemas" run build
```
5. Build experience:
```shell
cd packages/experience
pnpm run build
```
It will create a `/dist` folder with the customized UI build.

## How to run locally

1. Make changes in the `packages/experience` folder
2. Run `Vite` dev from within `packages/experience`:
```shell
pnpm run dev
```
3. In a separate terminal, run tunnel service ([doc](https://docs.logto.io/customization/bring-your-ui/debug-and-test-your-custom-ui-locally)):
```shell
npx @logto/tunnel -p 9000 --experience-uri http://localhost:5001/ --endpoint https://auth.zerve-dev.io/
```
4. Change environment variable in the [frontend](https://github.com/Zerve-AI/frontend) repository
```
VITE_LOGTO_ENDPOINT=http://localhost:9000/ 
```

Now the local app will show the local Logto experience.