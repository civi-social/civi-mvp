/**
 * Layout related components
 */

import { createStyleSheet, Spacing } from "~/ui/styles";

interface StyleComponent {
  style?: React.CSSProperties;
}

export const Container: React.FC<StyleComponent> = ({ children, style }) => (
  <div style={{ ...layoutStyles.container, ...(style || {}) }}>{children}</div>
);

export const Grid: React.FC<StyleComponent> = ({ children, style }) => (
  <section style={{ ...layoutStyles.autoGrid, ...(style || {}) }}>
    {children}
  </section>
);

export const Col: React.FC<StyleComponent> = ({ children, style }) => (
  <div style={{ ...layoutStyles.gridCol, ...(style || {}) }}>{children}</div>
);

const layoutStyles = createStyleSheet({
  container: {
    minHeight: "100vh",
  },
  autoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gridGap: "1rem",
  },
  gridCol: {
    padding: Spacing.FOUR,
    textAlign: "center",
    fontSize: "1.2rem",
  },
});