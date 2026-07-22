from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "muhammad-rizky-syadrie-resume.pdf"


def register_fonts() -> tuple[str, str]:
    candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/Library/Fonts/Arial.ttf"),
    ]
    bold_candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
        Path("/Library/Fonts/Arial Bold.ttf"),
    ]
    regular = next((path for path in candidates if path.exists()), None)
    bold = next((path for path in bold_candidates if path.exists()), None)
    if regular and bold:
        pdfmetrics.registerFont(TTFont("ResumeSans", str(regular)))
        pdfmetrics.registerFont(TTFont("ResumeSansBold", str(bold)))
        return "ResumeSans", "ResumeSansBold"
    return "Helvetica", "Helvetica-Bold"


BODY_FONT, BOLD_FONT = register_fonts()

COLORS = {
    "ink": HexColor("#121826"),
    "muted": HexColor("#536071"),
    "accent": HexColor("#B85D12"),
    "rule": HexColor("#D6DAE0"),
}


def styles() -> dict[str, ParagraphStyle]:
    return {
        "name": ParagraphStyle(
            "Name",
            fontName=BOLD_FONT,
            fontSize=22,
            leading=24,
            textColor=COLORS["ink"],
            spaceAfter=3,
        ),
        "role": ParagraphStyle(
            "Role",
            fontName=BODY_FONT,
            fontSize=10.5,
            leading=13,
            textColor=COLORS["accent"],
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            fontName=BODY_FONT,
            fontSize=7.8,
            leading=10,
            textColor=COLORS["muted"],
            spaceAfter=9,
        ),
        "summary": ParagraphStyle(
            "Summary",
            fontName=BODY_FONT,
            fontSize=8.5,
            leading=11.4,
            textColor=COLORS["ink"],
            spaceAfter=7,
        ),
        "section": ParagraphStyle(
            "Section",
            fontName=BOLD_FONT,
            fontSize=9.5,
            leading=11,
            textColor=COLORS["accent"],
            spaceBefore=4,
            spaceAfter=4,
            borderPadding=(0, 0, 2, 0),
            borderWidth=0,
        ),
        "job": ParagraphStyle(
            "Job",
            fontName=BOLD_FONT,
            fontSize=8.7,
            leading=10.5,
            textColor=COLORS["ink"],
            spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "Meta",
            fontName=BODY_FONT,
            fontSize=7.5,
            leading=9.3,
            textColor=COLORS["muted"],
            spaceAfter=2,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            fontName=BODY_FONT,
            fontSize=7.8,
            leading=10.2,
            leftIndent=10,
            firstLineIndent=-7,
            bulletIndent=2,
            textColor=COLORS["ink"],
            spaceAfter=1.4,
        ),
        "small": ParagraphStyle(
            "Small",
            fontName=BODY_FONT,
            fontSize=7.7,
            leading=10.2,
            textColor=COLORS["ink"],
            spaceAfter=2,
        ),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(COLORS["rule"])
    canvas.setLineWidth(0.5)
    canvas.line(16 * mm, 12 * mm, width - 16 * mm, 12 * mm)
    canvas.setFont(BODY_FONT, 6.8)
    canvas.setFillColor(COLORS["muted"])
    canvas.drawString(16 * mm, 8.5 * mm, "Muhammad Rizky Syadrie - Resume")
    canvas.drawRightString(width - 16 * mm, 8.5 * mm, "Jakarta, Indonesia")
    canvas.restoreState()


def bullet(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(f"- {text}", style)


def build_resume() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    width, height = A4
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=13 * mm,
        bottomMargin=16 * mm,
        title="Muhammad Rizky Syadrie - Resume",
        author="Muhammad Rizky Syadrie",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        width - doc.leftMargin - doc.rightMargin,
        height - doc.topMargin - doc.bottomMargin,
        id="resume",
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=header_footer)])
    s = styles()
    story = [
        Paragraph("Muhammad Rizky Syadrie", s["name"]),
        Paragraph("Full-Stack &amp; Cloud Software Engineer", s["role"]),
        Paragraph(
            "Jakarta, Indonesia (UTC+7) &nbsp; | &nbsp; muhammad.syadrie11@gmail.com &nbsp; | &nbsp; linkedin.com/in/mrizkysyadrie &nbsp; | &nbsp; github.com/pt-arunikaciptasahaja",
            s["contact"],
        ),
        Paragraph(
            "Software Engineer with 6+ years of experience building and modernizing enterprise web platforms across fintech and e-commerce. Google Cloud Certified Associate Cloud Engineer specializing in React, Next.js, TypeScript, Node.js, and cloud optimization, backed by 9 years of banking operational management experience.",
            s["summary"],
        ),
        Paragraph("SELECTED IMPACT", s["section"]),
        Paragraph(
            "<b>60%</b> storage cost reduction &nbsp; | &nbsp; <b>300K+</b> monthly visitors supported &nbsp; | &nbsp; <b>85%</b> load-speed improvement &nbsp; | &nbsp; <b>GCP</b> Associate Cloud Engineer",
            s["small"],
        ),
        Paragraph("EXPERIENCE", s["section"]),
        KeepTogether(
            [
                Paragraph("Software Engineer - PT Adira Dinamika Multifinance Tbk", s["job"]),
                Paragraph("Aug 2022 - Present | Jakarta, Indonesia", s["meta"]),
                bullet("Maintained momotor.id and momobil.id, supporting 100K-300K monthly visits.", s["bullet"]),
                bullet("Reduced media host storage expenses by up to 60% through automated asset lifecycle archiving.", s["bullet"]),
                bullet("Modernized legacy codebases to React and Next.js, improving load speeds by up to 85%.", s["bullet"]),
                bullet("Implemented JSON-LD, XML sitemaps, Google Analytics, and Microsoft Clarity.", s["bullet"]),
                bullet("Built Docker CI/CD pipelines with SonarQube quality checks and Snyk security controls.", s["bullet"]),
            ]
        ),
        Spacer(1, 3),
        KeepTogether(
            [
                Paragraph("Software Developer (Volunteer) - Binar Academy", s["job"]),
                Paragraph("Apr 2020 - Aug 2022 | Indonesia", s["meta"]),
                bullet("Volunteered to develop and maintain Binar Academy's mobile application and website using Node.js, Express, React, and RESTful APIs within Agile/Scrum teams.", s["bullet"]),
                bullet("Implemented JWT authentication, pagination, role-based access control, and query optimization.", s["bullet"]),
            ]
        ),
        Spacer(1, 3),
        Paragraph("PREVIOUS PROFESSIONAL EXPERIENCE", s["section"]),
        KeepTogether(
            [
                Paragraph("Area Operations Manager - PT Bank Sinarmas Tbk", s["job"]),
                Paragraph("2011 - 2020 | Indonesia", s["meta"]),
                bullet("Oversaw operational performance across 21 branches in Jakarta, Tangerang, and Bekasi, ensuring consistent service delivery and operational standards.", s["bullet"]),
                bullet("Managed internal controls, regulatory compliance, operational risk, and stakeholder coordination across retail and corporate banking services.", s["bullet"]),
            ]
        ),
        Paragraph("SELECTED PROJECTS", s["section"]),
        Paragraph("<b>Alpha Stream Terminal</b> - Real-time Solana and Pump.fun market intelligence dashboard built with Next.js, TypeScript, Web3 APIs, and Recharts.", s["small"]),
        Paragraph("<b>MVHome (OFI.id)</b> - Enterprise broadband platform with dynamic coverage checks, onboarding funnels, secure services, and CMS operations.", s["small"]),
        Paragraph("<b>Tiny Bitty</b> - Direct-to-consumer catalog, hamper bundle builder, analytics, and WhatsApp-assisted checkout experience.", s["small"]),
        Paragraph("SKILLS &amp; CERTIFICATIONS", s["section"]),
        Paragraph("<b>Frontend:</b> React, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux, Web Vitals", s["small"]),
        Paragraph("<b>Backend &amp; Data:</b> Node.js, Express, Go, REST, GraphQL, PostgreSQL, MySQL, Redis", s["small"]),
        Paragraph("<b>Cloud &amp; DevOps:</b> GCP, Docker, Kubernetes, GitHub Actions, SonarQube, Snyk, Kibana", s["small"]),
        Paragraph("<b>Certifications:</b> Google Cloud Certified - Associate Cloud Engineer; Binar Academy - Full-Stack Web Development", s["small"]),
    ]
    doc.build(story)


if __name__ == "__main__":
    build_resume()
