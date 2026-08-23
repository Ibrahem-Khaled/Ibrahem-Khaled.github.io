import { TECH_TAGS } from '../data/content'

export default function TechMarquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map(copy => (
          <div key={copy} className="marquee-item">
            {TECH_TAGS.map(tag => (
              <span key={`${copy}-${tag}`} className="me-14 inline-flex items-center gap-14">
                {tag}
                <span className="sep">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
