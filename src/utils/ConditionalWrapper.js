export const ConditionalWrapper = ({ children, condition, wrapper }) =>
  condition ? wrapper(children) : children;
