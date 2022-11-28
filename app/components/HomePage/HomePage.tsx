import civiLogo from "~/assets/civi-temp-logo.png";
import { createStyleSheet, Skin, Spacing } from "~/styles";

export default function HomePage() {
  return (
    <div style={styles.container}>
      <AutoGrid>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
        <AutoColumn>
          A Social Network To Directly Connect Elected Officials To Verified
          Residents
        </AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>The Anti Hot Take Social Network</AutoColumn>
        <AutoColumn>Reliable Poll Data</AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>For Residents</AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>know what issues are on the table</AutoColumn>
        <AutoColumn>have topical, civil social interactions</AutoColumn>
        <AutoColumn>make their voices heard by those in power</AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>For Elected Officials</AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>get feedback from verified constituents</AutoColumn>
        <AutoColumn>poll verified constituents on current topics</AutoColumn>
        <AutoColumn>demonstrate they are listening</AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>
          “The preferences of the average American appear to have only a
          miniscule, near-zero, statistically non-significant impact upon public
          policy.” -Gilens & Page, Perspectives in Politics
        </AutoColumn>
      </AutoGrid>
      <AutoGrid>
        <AutoColumn>We Want Your Help</AutoColumn>
      </AutoGrid>
    </div>
  );
}

const AutoGrid: React.FC = ({ children }) => (
  <section style={styles.autoGrid}>{children}</section>
);

const AutoColumn: React.FC = ({ children }) => (
  <div style={styles.section}>
    <div style={styles.name}>{children}</div>
  </div>
);

const styles = createStyleSheet({
  container: {
    minHeight: "100vh",
    padding: Spacing.FOUR,
  },
  flex1: {
    flex: 1,
  },
  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  name: {
    color: Skin.Black,
    fontWeight: 700,
    fontSize: "2rem",
  },
  logo: {
    //   filter: "brightness(0) invert(1)",
    maxHeight: "60px",
  },
  section: {
    //   background: Skin.PrimaryPink,
    padding: Spacing.FOUR,
    textAlign: "center",
    fontSize: "1.2rem",
  },
  flexDirCol: {
    flexDirection: "column",
  },
  flexDirRow: {
    flexDirection: "row",
  },
  autoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gridGap: "1rem",
  },
});
