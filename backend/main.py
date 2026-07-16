import os
import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext

from .database import get_db, engine, Base
from . import models, pricing_engine, pdf_generator

# JWT Config
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-klstudios-key-998877")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 Hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize FastAPI
app = FastAPI(title="KL Studios API Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup: Create tables and seed services
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    
    # Seed default services if they do not exist
    db = next(get_db())
    try:
        # Check if services exist
        existing = db.query(models.Service).first()
        if not existing:
            default_services = [
                models.Service(id="website", name="Website Development", category="development", base_price=1500.0),
                models.Service(id="webapp", name="Custom Web Application", category="development", base_price=5000.0),
                models.Service(id="design", name="Graphic Design", category="creative", base_price=150.0),
                models.Service(id="photography", name="Professional Photography", category="production", base_price=400.0),
                models.Service(id="videography", name="Professional Videography", category="production", base_price=1000.0),
                models.Service(id="printing", name="Printing Services", category="production", base_price=50.0),
                models.Service(id="branding", name="Brand Identity & Design", category="creative", base_price=500.0),
                models.Service(id="ai_solutions", name="AI Solutions & Chatbots", category="development", base_price=3000.0),
                models.Service(id="seo", name="SEO Optimization", category="creative", base_price=400.0),
                models.Service(id="automation", name="Business Automation", category="development", base_price=2000.0),
            ]
            db.add_all(default_services)
            
            # Seed default admin & staff for immediate local development
            admin_pwd = pwd_context.hash("admin123")
            client_pwd = pwd_context.hash("client123")
            
            admin_user = models.User(
                email="admin@klstudios.co",
                password_hash=admin_pwd,
                full_name="Kalaphol Admin",
                role="admin",
                phone="+233555123456"
            )
            staff_user = models.User(
                email="staff@klstudios.co",
                password_hash=admin_pwd,
                full_name="Legacy Designer",
                role="staff",
                role_title="designer",
                phone="+233555987654"
            )
            client_user = models.User(
                email="client@example.com",
                password_hash=client_pwd,
                full_name="John Doe",
                role="client",
                phone="+233555000111"
            )
            db.add_all([admin_user, staff_user, client_user])
            db.commit()
            print("[Database] Seed completed successfully.")
    except Exception as e:
        print(f"[Database] Seeding error: {e}")
    finally:
        db.close()


# Pydantic schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "client"
    role_title: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str
    email: str

class OrderCreate(BaseModel):
    service_id: str
    selections: dict
    timeline: str
    discount_code: Optional[str] = None

class TicketCreate(BaseModel):
    order_id: Optional[str] = None
    subject: str
    message: str

class MessageSend(BaseModel):
    text: str

class TicketReplyAdmin(BaseModel):
    ticket_id: int
    text: str

class OrderStatusUpdate(BaseModel):
    status: str
    staff_assigned_id: Optional[int] = None


# JWT helper
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user_from_token(token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Middleware Dependency
def get_current_user(token: str, db: Session = Depends(get_db)):
    # Look for auth headers or query parameters
    return get_current_user_from_token(token, db)


# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = pwd_context.hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        password_hash=hashed_pwd,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role,
        role_title=user_data.role_title
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log Action
    log = models.ActivityLog(user_id=new_user.id, user_name=new_user.full_name, action="User Register", details=f"Registered email: {new_user.email}")
    db.add(log)
    db.commit()
    
    token = create_access_token({"sub": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role,
        "full_name": new_user.full_name,
        "email": new_user.email
    }

@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not pwd_context.verify(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "email": user.email
    }


# --- SERVICES & PRICING ENDPOINTS ---

@app.get("/api/services")
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.post("/api/services/calculate-price")
def calculate_quote(service_id: str, selections: dict, discount_code: Optional[str] = None, db: Session = Depends(get_db)):
    discount_val = 0.0
    if discount_code:
        code_record = db.query(models.DiscountCode).filter(
            models.DiscountCode.code == discount_code,
            models.DiscountCode.active == True,
            models.DiscountCode.expires_at > datetime.datetime.utcnow()
        ).first()
        if code_record:
            discount_val = code_record.percent_discount / 100.0  # apply percent discount

    # Calculate price
    calc = pricing_engine.calculate_price(service_id, selections)
    
    # Apply promo discount
    if discount_val > 0.0:
        raw_discount = calc["subtotal"] * discount_val
        calc["discount"] = raw_discount
        calc["total"] = max(0.0, calc["subtotal"] - raw_discount + (calc["subtotal"] - raw_discount) * 0.05)
        calc["deposit"] = calc["total"] * 0.5
        calc["balance"] = calc["total"] * 0.5
        
    return calc


# --- ORDERS ENDPOINTS ---

@app.post("/api/orders")
def create_order(order_data: OrderCreate, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    
    # Calculate costs
    calc = calculate_quote(order_data.service_id, order_data.selections, order_data.discount_code, db)
    
    # Format a unique Order ID
    order_num = f"ORD-{datetime.datetime.now().strftime('%y%m%d%H%M')}-{db.query(models.Order).count()+1}"
    
    new_order = models.Order(
        id=order_num,
        client_id=user.id,
        service_id=order_data.service_id,
        subtotal=calc["subtotal"],
        discount=calc["discount"],
        tax=calc["tax"],
        total=calc["total"],
        paid_amount=0.0,
        balance=calc["total"],
        payment_status="pending",
        options_selected=order_data.selections,
        timeline=order_data.timeline,
        status="pending"
    )
    db.add(new_order)
    
    # Generate Invoice
    inv_num = f"INV-{datetime.datetime.now().strftime('%y%m%d%H%M')}-{db.query(models.Invoice).count()+1}"
    new_invoice = models.Invoice(
        id=inv_num,
        order_id=order_num,
        invoice_number=inv_num,
        amount=calc["total"],
        status="unpaid",
        due_date=datetime.datetime.utcnow() + datetime.timedelta(days=7)
    )
    db.add(new_invoice)
    
    # Generate Contract text template
    contract_txt = f"""SERVICE AGREEMENT & CONTRACT
Order ID: {order_num}
Client: {user.full_name} ({user.email})
Date: {datetime.date.today().strftime('%B %d, %Y')}

1. SERVICES AND WORK SCOPE
KL Studios agrees to deliver {order_data.service_id.upper()} services based on selections:
{order_data.selections}

2. TIMELINE AND MILESTONES
Total target delivery time is: {order_data.timeline}. Work begins post deposit.

3. FINANCIAL TERMS
- Total Quote: GH¢ {calc['total']:,.2f}
- Deposit (50%): GH¢ {calc['deposit']:,.2f}
- Remaining Balance: GH¢ {calc['balance']:,.2f}

4. RIGHTS AND DEVIATIONS
Final intellectual properties transfers to Client upon completion and full balance settlement.
"""
    new_contract = models.Contract(
        id=f"CON-{datetime.datetime.now().strftime('%y%m%d%H%M')}",
        order_id=order_num,
        contract_text=contract_txt,
        signed_status=False
    )
    db.add(new_contract)
    
    # Activity Log
    log = models.ActivityLog(user_id=user.id, user_name=user.full_name, action="Create Order", details=f"Created order {order_num} for service: {order_data.service_id}")
    db.add(log)
    
    db.commit()
    return {"order_id": order_num, "invoice_id": inv_num, "total": calc["total"]}

@app.get("/api/orders/client")
def get_client_orders(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    return db.query(models.Order).filter(models.Order.client_id == user.id).all()

@app.get("/api/orders/{order_id}")
def get_order_details(order_id: str, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    # Check permission (must be owner, or admin/staff)
    if order.client_id != user.id and user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    invoice = db.query(models.Invoice).filter(models.Invoice.order_id == order_id).first()
    contract = db.query(models.Contract).filter(models.Contract.order_id == order_id).first()
    
    return {
        "order": order,
        "invoice": invoice,
        "contract": contract
    }


# --- PAYMENTS ENDPOINTS ---

@app.post("/api/payments/pay")
def pay_invoice(order_id: str, token: str, amount: float, method: str = "card", db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    invoice = db.query(models.Invoice).filter(models.Invoice.order_id == order_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    # Mock Paystack transaction success
    order.paid_amount += amount
    order.balance = max(0.0, order.total - order.paid_amount)
    
    if order.paid_amount >= order.total:
        order.payment_status = "fully_paid"
        invoice.status = "paid"
    elif order.paid_amount >= (order.total * 0.5):
        order.payment_status = "deposit_paid"
        invoice.status = "deposit_paid"
        
    # Update order workflow if we just paid the deposit
    if order.status == "pending" and order.paid_amount >= (order.total * 0.5):
        order.status = "requirements_received"
        
    # Sign Contract automatically on payment for simplicity, or keep pending
    contract = db.query(models.Contract).filter(models.Contract.order_id == order_id).first()
    if contract and order.payment_status != "pending":
        contract.signed_status = True
        contract.signed_at = datetime.datetime.utcnow()
        
    # Log Payment
    log = models.ActivityLog(user_id=user.id, user_name=user.full_name, action="Pay Invoice", details=f"Paid GH¢ {amount:.2f} via {method} for order {order_id}")
    db.add(log)
    
    db.commit()
    return {"message": "Payment verified successfully", "paid_amount": order.paid_amount, "status": order.payment_status}


# --- PDF DOWNLOAD ENDPOINTS ---

@app.get("/api/pdf/{doc_type}/{order_id}")
def download_doc_pdf(doc_type: str, order_id: str, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.client_id != user.id and user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    invoice = db.query(models.Invoice).filter(models.Invoice.order_id == order_id).first()
    contract = db.query(models.Contract).filter(models.Contract.order_id == order_id).first()
    
    # Gather selections description
    selections_list = []
    if order.options_selected:
        for k, v in order.options_selected.items():
            k_name = k.replace("_", " ").title()
            selections_list.append((k_name, str(v)))
            
    # Build financial data
    financial_data = {
        "subtotal": order.subtotal,
        "discount": order.discount,
        "tax": order.tax,
        "total": order.total,
        "deposit": order.total * 0.5,
        "balance": order.balance
    }
    
    pdf_payload = {
        "number": order.id if doc_type == "quotation" else (invoice.invoice_number if invoice else "INV-N/A"),
        "client_name": user.full_name,
        "client_email": user.email,
        "service_name": order.service_id.replace("_", " ").title(),
        "selections": selections_list,
        "financial": financial_data,
        "terms": contract.contract_text if (contract and doc_type == "contract") else None
    }
    
    pdf_buffer = pdf_generator.generate_pdf_document(doc_type, pdf_payload)
    
    headers = {
        "Content-Disposition": f"attachment; filename={doc_type}_{order_id}.pdf"
    }
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)


# --- TICKETS ENDPOINTS ---

@app.post("/api/tickets")
def create_ticket(ticket_data: TicketCreate, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    
    initial_msg = [{"sender": "client", "text": ticket_data.message, "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}]
    
    new_ticket = models.SupportTicket(
        order_id=ticket_data.order_id,
        client_id=user.id,
        subject=ticket_data.subject,
        status="open",
        messages=initial_msg
    )
    db.add(new_ticket)
    db.commit()
    return {"message": "Ticket created successfully", "ticket_id": new_ticket.id}

@app.get("/api/tickets")
def list_tickets(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.role in ["admin", "staff"]:
        return db.query(models.SupportTicket).all()
    return db.query(models.SupportTicket).filter(models.SupportTicket.client_id == user.id).all()

@app.post("/api/tickets/{ticket_id}/message")
def send_ticket_message(ticket_id: int, msg: MessageSend, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    sender_role = "client" if ticket.client_id == user.id else "support"
    
    current_msgs = list(ticket.messages) if ticket.messages else []
    current_msgs.append({
        "sender": sender_role,
        "sender_name": user.full_name,
        "text": msg.text,
        "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    })
    ticket.messages = current_msgs
    ticket.status = "open" if sender_role == "client" else "in_progress"
    
    db.commit()
    return ticket


# --- ADMIN CONTROL ENDPOINTS ---

@app.get("/api/admin/orders")
def admin_list_orders(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    orders = db.query(models.Order).all()
    # Format return list with client full name
    result = []
    for o in orders:
        client = db.query(models.User).filter(models.User.id == o.client_id).first()
        staff = db.query(models.User).filter(models.User.id == o.staff_assigned_id).first() if o.staff_assigned_id else None
        result.append({
            "order": o,
            "client_name": client.full_name if client else "Unknown Client",
            "staff_name": staff.full_name if staff else "Unassigned"
        })
    return result

@app.put("/api/admin/orders/{order_id}")
def admin_update_order(order_id: str, status_data: OrderStatusUpdate, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status_data.status
    if status_data.staff_assigned_id:
        order.staff_assigned_id = status_data.staff_assigned_id
        
    # Log admin action
    log = models.ActivityLog(
        user_id=user.id,
        user_name=user.full_name,
        action="Admin Update Order",
        details=f"Updated {order_id} status to {status_data.status}, staff to {status_data.staff_assigned_id}"
    )
    db.add(log)
    db.commit()
    return order

@app.get("/api/admin/staff")
def admin_list_staff(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return db.query(models.User).filter(models.User.role.in_(["admin", "staff"])).all()

@app.get("/api/admin/analytics")
def admin_analytics(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
        
    total_orders = db.query(models.Order).count()
    total_revenue = sum(o.paid_amount for o in db.query(models.Order).all())
    pending_orders = db.query(models.Order).filter(models.Order.status == "pending").count()
    in_progress_orders = db.query(models.Order).filter(models.Order.status == "in_progress").count()
    completed_orders = db.query(models.Order).filter(models.Order.status == "completed").count()
    
    # Service shares
    services = db.query(models.Order.service_id).all()
    service_shares = {}
    for s in services:
        s_id = s[0]
        service_shares[s_id] = service_shares.get(s_id, 0) + 1
        
    # Recent logs
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.created_at.desc()).limit(15).all()
    
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "status_distribution": {
            "pending": pending_orders,
            "in_progress": in_progress_orders,
            "completed": completed_orders
        },
        "service_distribution": service_shares,
        "activity_logs": logs
    }
