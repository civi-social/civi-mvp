import civiLogo from "~/assets/civi-temp-logo.png";
import chiSkylineOutline from "~/assets/chicago-skyline-outline.png";
import type { StyleHack } from "~/styles";
import { createStyleSheet, Skin, Spacing } from "~/styles";
import { useNavigate } from "@remix-run/react";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Container style={styles.background}>
      <Grid style={{ background: Skin.White }}>
        <Col style={{ display: "flex", justifyContent: "center" }}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </Col>
      </Grid>
      <Grid style={styles.mainHero}>
        <Col style={styles.hero}>
          <div style={styles.heroTitle}>Vote With Your Representative</div>
          <div style={styles.heroDescription}>
            We want to build a way for you connect to your representative. Vote
            on legislation they will vote on, and let them know what you think.
          </div>
          <img
            src={chiSkylineOutline}
            style={{ width: "300px" }}
            alt="Chicago Skyline Outline"
          />
          <div>Our pilot market is Chicago. Do you live here?</div>
          <div>
            <button
              style={styles.ctaButton}
              onClick={() => {
                navigate("/search");
              }}
            >
              Find Your Chicago Rep
            </button>
          </div>
        </Col>
        {/* empty column to half this grid */}
        <Col />
      </Grid>
    </Container>
  );
}

const styles = createStyleSheet({
  background: {
    backgroundSize: "cover",
    backgroundImage:
      "url('https://upload.wikimedia.org/wikipedia/commons/e/e5/BigLaw_Chicago.jpg')",
  },
  heroTitle: {
    color: Skin.Black,
    fontWeight: 900,
    fontSize: "2rem",
  },
  mainHero: {
    minHeight: "calc(100vh - 90px)",
    alignItems: "center",
    background: "rgb(255 255 255 / 50%)" as StyleHack,
    backdropFilter: "blur(20px)",
  },
  hero: {
    height: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    borderRadius: "0 20px 20px 0",
  },
  heroDescription: {
    color: Skin.Black,
    fontWeight: 400,
    fontSize: "1.5rem",
  },
  logo: {
    height: "50px",
  },
  ctaButton: {
    marginTop: Spacing.FOUR,
    paddingLeft: Spacing.TWO,
    paddingRight: Spacing.TWO,
    paddingTop: Spacing.ONE,
    paddingBottom: Spacing.ONE,

    background: Skin.PrimaryPink,
    color: Skin.White,

    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "1.1rem",

    boxShadow: "0px 1px 3px rgb(0 0 0 / 30%)",
    borderRadius: "5px",
  },
});

/**
 * Layout related components
 */

interface StyleComponent {
  style?: React.CSSProperties;
}

const Container: React.FC<StyleComponent> = ({ children, style }) => (
  <div style={{ ...layoutStyles.container, ...(style || {}) }}>{children}</div>
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
