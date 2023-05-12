type Fn = () => JSX.Element
type WithFn = (arg: Fn) => Fn

export const compose =
  (...fns: WithFn[]) =>
  (x: Fn) =>
    fns.reduceRight((acc, cur) => cur(acc), x)
