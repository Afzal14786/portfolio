import { siteConfig } from "@/config/site";

const socialLinks = [
  {
    label: "GitHub",
    href: siteConfig.social.github,
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
  },
  {
    label: "X",
    href: siteConfig.social.x,
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
  },
];

export function Contact() {
  return (
    <section
      className="site-container contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-heading">
        <div className="section-label">
          <span>CONTACT / 05</span>
          <span>CONVERSATIONS · OPPORTUNITIES · COLLABORATION</span>
        </div>

        <div className="contact-content">
          <div className="contact-copy">
            <p className="contact-eyebrow">GET IN TOUCH</p>

            <h2 id="contact-title">
              Let&apos;s build
              <br />
              <em>something meaningful.</em>
            </h2>

            <p className="contact-description">
              I&apos;m open to software engineering internship opportunities,
              especially backend-focused roles. I&apos;m also happy to connect
              with people building thoughtful software.
            </p>
          </div>

          <div className="contact-details">
            <div className="contact-email">
              <span className="contact-detail-label">EMAIL</span>

              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </div>

            <div className="contact-socials">
              <span className="contact-detail-label">ELSEWHERE</span>

              <ul>
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit my ${social.label} profile`}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
