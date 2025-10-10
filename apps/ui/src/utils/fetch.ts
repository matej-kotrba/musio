export function getOptionsForNgrokCrossSite() {
  return {
    credentials: "include",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  } as const;
}

// type Options = Record<string, string | Record<string, string>>

// export function options() {
//   return {
//     full: {},
//     get: () => options,
//     disableNgrokWarning,
//     crossSite
//   }
// }

// const disableNgrokWarning = (options: Options) => {
//   return {
//     headers: {
//       "ngrok-skip-browser-warning": "true",
//     }
//   }
// }

// const crossSite = () => {
//   return {
//     credentials: "include"
//   }
// }
