import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf_document(doc_type: str, data: dict) -> io.BytesIO:
    """
    Generates a premium PDF document for KL Studios.
    doc_type: "quotation", "invoice", "receipt", "contract"
    data: Dictionary containing fields like:
          - number (INV-XXX, QT-XXX, etc.)
          - date
          - client_name, client_email
          - service_name
          - selections (list of selected options and details)
          - financial (dict containing subtotal, discount, tax, total, deposit, balance)
          - terms/text (for contract or notes)
    """
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom elegant styles matching KL Studios luxury aesthetic (Gold/Charcoal/Cream)
    gold_color = colors.HexColor("#D4AF37")
    charcoal_color = colors.HexColor("#1A1A1A")
    grey_color = colors.HexColor("#555555")
    light_bg = colors.HexColor("#F9F8F6")
    
    # Define custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=charcoal_color,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=gold_color,
        textTransform="uppercase",
        spaceAfter=15
    )
    
    body_style = ParagraphStyle(
        "DocBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=grey_color
    )
    
    body_bold = ParagraphStyle(
        "DocBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold"
    )
    
    header_right = ParagraphStyle(
        "HeaderRight",
        parent=body_style,
        alignment=2, # Right align
        fontSize=9,
        leading=12
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.white
    )

    story = []
    
    # --- HEADER SECTION ---
    # Two column header: Left (KL Studios info), Right (Doc Type, Date, Number)
    header_data = [
        [
            Paragraph("<b>KL STUDIOS</b><br/>Kalaphol & Legacy Studios<br/>Accra, Ghana<br/>services@klstudios.co", body_style),
            Paragraph(f"<b>{doc_type.upper()}</b><br/>No: {data.get('number', 'N/A')}<br/>Date: {data.get('date', datetime.date.today().strftime('%B %d, %Y'))}", header_right)
        ]
    ]
    header_table = Table(header_data, colWidths=[4.0 * inch, 3.5 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 15),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))
    
    # Decorative Gold Divider Line
    line_table = Table([[""]], colWidths=[7.5 * inch], rowHeights=[2])
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), gold_color),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 20))
    
    # --- CLIENT BILLING INFO ---
    billing_data = [
        [
            Paragraph(f"<b>PREPARED FOR:</b><br/>{data.get('client_name', 'Valued Client')}<br/>{data.get('client_email', '')}", body_style),
            Paragraph("<b>SERVICE INQUIRY:</b><br/>" + data.get('service_name', 'Digital Services').upper(), body_style)
        ]
    ]
    billing_table = Table(billing_data, colWidths=[4.0 * inch, 3.5 * inch])
    billing_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(billing_table)
    story.append(Spacer(1, 25))
    
    # --- DETAILS / SPECIFICATIONS TABLE ---
    # Title
    story.append(Paragraph("Project Details & Specifications", subtitle_style))
    
    # Table header
    table_rows = [[
        Paragraph("Description / Option", table_header_style),
        Paragraph("Value / Details", table_header_style)
    ]]
    
    # Populate selections
    selections = data.get("selections", [])
    if not selections:
        selections = [("Service Standard Selection", "Base Package")]
        
    for item, desc in selections:
        table_rows.append([
            Paragraph(str(item), body_bold),
            Paragraph(str(desc), body_style)
        ])
        
    specs_table = Table(table_rows, colWidths=[3.0 * inch, 4.5 * inch])
    specs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (1,0), charcoal_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg])
    ]))
    story.append(specs_table)
    story.append(Spacer(1, 25))
    
    # --- PRICING SUMMARY ---
    story.append(Paragraph("Financial Summary", subtitle_style))
    
    fin = data.get("financial", {})
    fin_rows = [
        [Paragraph("Subtotal", body_style), f"GH¢ {fin.get('subtotal', 0.0):,.2f}"],
        [Paragraph("Discount", body_style), f"- GH¢ {fin.get('discount', 0.0):,.2f}"],
        [Paragraph("Tax (5%)", body_style), f"GH¢ {fin.get('tax', 0.0):,.2f}"],
        [Paragraph("<b>TOTAL AMOUNT</b>", body_bold), f"<b>GH¢ {fin.get('total', 0.0):,.2f}</b>"],
        [Paragraph("<b>Deposit Required (50%)</b>", body_bold), f"GH¢ {fin.get('deposit', 0.0):,.2f}"],
        [Paragraph("<b>Remaining Balance</b>", body_bold), f"GH¢ {fin.get('balance', 0.0):,.2f}"]
    ]
    
    fin_table = Table(fin_rows, colWidths=[5.0 * inch, 2.5 * inch])
    fin_table.setStyle(TableStyle([
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,-3), (1,-3), 1, charcoal_color), # Bold total top line
        ('BACKGROUND', (0,-3), (1,-3), light_bg),
        ('LINEBELOW', (0,-1), (1,-1), 1, gold_color)
    ]))
    story.append(fin_table)
    story.append(Spacer(1, 30))
    
    # --- CONTRACT / TERMS SECTION ---
    if doc_type == "contract" or data.get("terms"):
        story.append(PageBreak())
        story.append(Paragraph("TERMS OF AGREEMENT", title_style))
        story.append(Paragraph("Please read the following service conditions carefully.", subtitle_style))
        
        contract_text = data.get("terms", "Standard Service Contract:\n1. Work commences upon 50% deposit payment.\n2. Timelines are subject to prompt client assets submission.\n3. Revisions are limited as per selection parameters.")
        for para in contract_text.split("\n"):
            if para.strip():
                story.append(Paragraph(para, body_style))
                story.append(Spacer(1, 8))
                
        story.append(Spacer(1, 40))
        # Signatures
        sig_data = [
            [
                Paragraph("<b>Client Signature</b><br/><br/><br/>____________________________", body_style),
                Paragraph("<b>KL Studios Representative</b><br/><br/><br/>____________________________", body_style)
            ]
        ]
        sig_table = Table(sig_data, colWidths=[3.75 * inch, 3.75 * inch])
        sig_table.setStyle(TableStyle([
            ('TOPPADDING', (0,0), (-1,-1), 20),
            ('ALIGN', (0,0), (-1,-1), 'CENTER')
        ]))
        story.append(sig_table)
    else:
        # Standard thank you note
        story.append(Paragraph("<b>Thank you for your business!</b><br/>For inquiries, email billing@klstudios.co or call +233 (0) 555 123 456.", body_style))
        
    doc.build(story)
    buffer.seek(0)
    return buffer
