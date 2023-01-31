import civiLogo from "~/assets/civi-temp-logo.png";
import type { StyleHack } from "~/styles";
import { createStyleSheet, Skin, Spacing } from "~/styles";
import { useNavigate } from "@remix-run/react";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Container>
      <GithubBanner url="https://github.com/civi-social/civi-mvp" />
      <Grid style={styles.mainContainer}>
        <Col style={styles.hero}>
          <div style={styles.logoContainer}>
            <img src={civiLogo} alt="Civi Logo" style={styles.logo} />
          </div>

          <div style={styles.heroTitleCity}>Chicago!</div>
          <div style={styles.heroTitle}>
            We Want To Let You Vote With Your Representative
          </div>
          <div style={styles.heroDescription}>
            <br />
            We are a non-profit, open source community looking to build a way
            for you connect to your representative. <br />
            <br /> Vote on legislation they will vote on, and let them know what
            you think.
          </div>
        </Col>
        <Col>
          <Card>
            <CardSection>
              <CardTitle>
                Progress{" "}
                <span style={{ fontSize: "0.9rem", fontWeight: 300 }}>
                  [last updated february 2022]
                </span>
              </CardTitle>
              <ul
                style={{
                  margin: Spacing.ONE,
                  padding: Spacing.ONE,
                }}
              >
                <li>✅ Find your local, state, and national representative</li>
                <li>✅ Find active Chicago legislation</li>
                <li>⏺ Find active Illinois and National legislation</li>
                <li>⏺ Vote on active legislation</li>
              </ul>
            </CardSection>
            <CardSection>
              <CardTitle>Help Us Build It!</CardTitle>
              <div>
                We work within the Chi Hack Night community.{" "}
                <a
                  style={styles.link}
                  href="https://chihacknight.slack.com/archives/C047500M5RS"
                >
                  Come join the Slack to see how you can contribute.
                </a>
              </div>
            </CardSection>
            <CardSection>
              <button
                style={styles.ctaButton}
                onClick={() => {
                  navigate("/search");
                }}
              >
                Check Out Our In Progress Demo
              </button>
            </CardSection>
          </Card>
          <Card>
            <CardSection>
              <MailChimpForm />
            </CardSection>
            <CardSection>
              <CardTitle>Follow Us On Social Media</CardTitle>
              <div>
                ...LOL 😬 We currently don't have any social media accounts.{" "}
                <a
                  style={styles.link}
                  href="https://chihacknight.slack.com/archives/C047500M5RS/p1675148248890889"
                >
                  But we could love your help to start one!
                </a>
              </div>
            </CardSection>
          </Card>
        </Col>
      </Grid>
    </Container>
  );
}

/**
 * src: https://tholman.com/github-corners/
 */
const GithubBanner = ({ url }: { url: string }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `
      <a href="${url}" class="github-corner" aria-label="View source on GitHub">
      <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
      </svg>
    </a>
    <style>
      .github-corner:hover .octo-arm {
        animation: octocat-wave 560ms ease-in-out
      }
    
      @keyframes octocat-wave {
    
        0%,
        100% {
          transform: rotate(0)
        }
    
        20%,
        60% {
          transform: rotate(-25deg)
        }
    
        40%,
        80% {
          transform: rotate(10deg)
        }
      }
    
      @media (max-width:500px) {
        .github-corner:hover .octo-arm {
          animation: none
        }
    
        .github-corner .octo-arm {
          animation: octocat-wave 560ms ease-in-out
        }
      }
    </style>`,
    }}
  ></div>
);
const MailChimpForm = () => {
  return (
    <div>
      <div id="mc_embed_signup">
        <form
          action="https://social.us11.list-manage.com/subscribe/post?u=5d27cdfc23603091d05858a9b&amp;id=e52325cbc0&amp;f_id=00f5a6e0f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_self"
        >
          <div id="mc_embed_signup_scroll">
            <CardTitle>Subscribe To Our Waitlist</CardTitle>
            <p style={{ marginBottom: Spacing.ONE }}>
              Join our newsletter to get updates on our progress, and be get
              early access to vote when we launch!
            </p>
            <div className="mc-field-group">
              <input
                type="email"
                defaultValue=""
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                required={true}
                placeholder="Email Address"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  paddingLeft: Spacing.TWO,
                  marginBottom: Spacing.FOUR,
                  fontSize: "1.2rem",
                }}
              />
              {/* cspell:disable-next-line */}
              <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
            </div>
            <div id="mce-responses" className="clear foot">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              ></div>
            </div>
            <div
              style={{ position: "absolute", left: "-5000px" }}
              aria-hidden="true"
            >
              <input
                type="text"
                /* cspell:disable-next-line */
                name="b_5d27cdfc23603091d05858a9b_e52325cbc0"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
            <div className="optionalParent">
              <div className="clear foot">
                <input
                  type="submit"
                  value="Subscribe"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="button"
                  style={styles.ctaButton}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Card: React.FC<StyleComponent> = ({ children, style }) => (
  <div style={{ ...styles.card, ...(style || {}) }}>{children}</div>
);

const CardSection: React.FC = ({ children }) => (
  <section style={{ margin: Spacing.FOUR, fontSize: "0.9rem" }}>
    {children}
  </section>
);

const CardTitle: React.FC = ({ children }) => (
  <h2
    style={{
      fontWeight: "bold",
      padding: Spacing.ZERO,
      marginTop: Spacing.TWO,
      marginBottom: Spacing.TWO,
      fontSize: "1.2rem",
      textAlign: "left",
    }}
  >
    {children}
  </h2>
);

const textColor = "#000000b3" as StyleHack;
const makeImageWhite = { filter: "brightness(0) invert(1);" };

const styles = createStyleSheet({
  card: {
    padding: Spacing.FOUR,
    marginTop: Spacing.FOUR,
    marginBottom: Spacing.FOUR,
    background: Skin.White,
    textAlign: "left",
  },
  link: {
    textDecoration: "underline",
    color: "#3886df" as StyleHack,
  },
  heroTitle: {
    color: textColor,
    fontWeight: 900,
    fontSize: "1.5rem",
  },
  heroTitleCity: {
    color: textColor,
    fontWeight: 300,
    fontSize: "2rem",
  },
  mainContainer: {
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "rgb(226 226 226 / 50%)" as StyleHack,
  },
  hero: {
    height: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    maxWidth: "500px",
    background: "#f86a9c" as StyleHack,
  },
  heroDescription: {
    color: textColor,
    fontWeight: 400,
    fontSize: "1rem",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: Spacing.TWO,
  },
  logo: {
    height: "30px",
    ...makeImageWhite,
  },
  ctaButton: {
    paddingLeft: "40px" as StyleHack,
    paddingRight: "40px" as StyleHack,
    paddingTop: Spacing.TWO,
    paddingBottom: Spacing.TWO,
    lineHeight: "1rem",

    background: "#3786df" as StyleHack,
    color: Skin.White,

    fontSize: "1.1rem",

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
