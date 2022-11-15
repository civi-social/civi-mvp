import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import civiLogo from "~/assets/civi-temp-logo.png";
import { getUser } from "~/session.server";
import { createStyleSheet, Skin, Spacing } from "~/styles";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect("/my-reps");
  }

  return json(null);
};

export default function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
      </div>
      <div style={styles.autoGrid}>
        <div style={styles.section}>
          <div style={styles.name}>
            A Social Network To Directly Connect Elected Officials To Verified
            Residents
          </div>
        </div>
        <div style={styles.section}>
          <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
        </div>
      </div>
    </div>
  );
}

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
    color: Skin.White,
    fontWeight: 700,
    fontSize: "2rem",
  },
  logo: {
    filter: "brightness(0) invert(1)",
    maxHeight: "60px",
  },
  section: {
    background: Skin.PrimaryPink,
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
