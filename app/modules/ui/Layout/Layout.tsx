/**
 * Layout related components
 */

import { classNames, createStyleSheet, Spacing } from "~/ui/styles";

interface StyleComponent {
  style?: React.CSSProperties;
  className?: React.HTMLAttributes<HTMLElement>["className"];
}

export const Container: React.FC<StyleComponent> = ({
  children,
  style,
  className,
}) => (
  <div
    className={className}
    style={{ ...layoutStyles.container, ...(style || {}) }}
  >
    {children}
  </div>
);

export const Grid: React.FC<StyleComponent> = ({
  children,
  style,
  className,
}) => (
  <section
    className={classNames(
      "grid-cols-1 lg:grid-cols-[minmax(300px,_500px)_1fr]",
      className
    )}
    style={{ ...layoutStyles.autoGrid, ...(style || {}) }}
  >
    {children}
  </section>
);

export const Col: React.FC<StyleComponent> = ({
  children,
  style,
  className,
}) => (
  <div
    className={className}
    style={{ ...layoutStyles.gridCol, ...(style || {}) }}
  >
    {children}
  </div>
);

const layoutStyles = createStyleSheet({
  container: {
    minHeight: "100vh",
  },
  autoGrid: {
    display: "grid",
    gridGap: "1rem",
  },
  gridCol: {
    padding: Spacing.FOUR,
    // textAlign: "center",
    // fontSize: "1.2rem",
  },
});
