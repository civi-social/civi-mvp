import civiLogo from "~/assets/civi-temp-logo.png";
import { createStyleSheet, Skin, Spacing } from "~/styles";

export default function HomePage() {
  return (
    <Container>
      <Grid>
        <Col>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </Col>
        <Col style={styles.name}>
          A Social Network To Directly Connect Elected Officials To Verified
          Residents
        </Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>The Anti Hot Take Social Network</Col>
        <Col style={styles.name}>Reliable Poll Data</Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>For Residents</Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>know what issues are on the table</Col>
        <Col style={styles.name}>have topical, civil social interactions</Col>
        <Col style={styles.name}>make their voices heard by those in power</Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>For Elected Officials</Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>get feedback from verified constituents</Col>
        <Col style={styles.name}>
          poll verified constituents on current topics
        </Col>
        <Col style={styles.name}>demonstrate they are listening</Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>
          “The preferences of the average American appear to have only a
          miniscule, near-zero, statistically non-significant impact upon public
          policy.” -Gilens & Page, Perspectives in Politics
        </Col>
      </Grid>
      <Grid>
        <Col style={styles.name}>We Want Your Help</Col>
      </Grid>
    </Container>
  );
}

const styles = createStyleSheet({
  name: {
    color: Skin.Black,
    fontWeight: 700,
    fontSize: "2rem",
  },
  logo: {
    //   filter: "brightness(0) invert(1)",
    maxHeight: "60px",
  },
});

/**
 * Layout related components
 */

interface StyleComponent {
  style?: React.CSSProperties;
}

const Container: React.FC = ({ children }) => (
  <div style={layoutStyles.container}>{children}</div>
);

const Grid: React.FC<StyleComponent> = ({ children, style }) => (
  <section style={{ ...layoutStyles.autoGrid, ...(style || {}) }}>
    {children}
  </section>
);

const Col: React.FC<StyleComponent> = ({ children, style }) => (
  <div style={{ ...layoutStyles.gridCol, ...(style || {}) }}>{children}</div>
);

const layoutStyles = createStyleSheet({
  container: {
    minHeight: "100vh",
    padding: Spacing.FOUR,
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
