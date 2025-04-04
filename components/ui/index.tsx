import type { ComponentPropsWithRef, ReactNode, ElementType } from "react";
import { forwardRef } from "react";

export type PolymorphicRef<C extends ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type ComponentProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
  variant?: string;
  size?: string;
} & ComponentPropsWithRef<C>;

export function createComponent<T extends ElementType, TV>(
  tag: T,
  variant: TV
) {
  const Component = forwardRef<unknown, ComponentProps<T>>(({ 
    as: Component = tag, 
    className,
    variant: variantProp,
    size,
    ...rest 
  }, ref) => {
    return (
      <Component
        ref={ref}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-types
        className={(variant as Function)({ 
          class: className,
          variant: variantProp,
          size,
          ...rest 
        })}
        {...rest}
      />
    );
  });
  
  Component.displayName = typeof tag === "string" ? `UI${tag.charAt(0).toUpperCase() + tag.slice(1)}` : "UIComponent";
  return Component;
}
