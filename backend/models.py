import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="client")  # "client", "admin", "staff"
    role_title = Column(String, nullable=True)  # "developer", "designer", "photographer", "accountant", "support"
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="client", foreign_keys="Order.client_id")
    assigned_tasks = relationship("Order", back_populates="staff_assigned", foreign_keys="Order.staff_assigned_id")
    tickets = relationship("SupportTicket", back_populates="client")

class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, index=True)  # e.g., "website", "design", "photography", "videography", "printing", "branding"
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # "development", "creative", "production"
    base_price = Column(Float, nullable=False)
    options_config = Column(JSON, nullable=True)  # Detailed features and prices config

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)  # e.g., "ORD-12345"
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(String, ForeignKey("services.id"), nullable=False)
    
    # Pricing fields
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0.0)
    balance = Column(Float, nullable=False)
    payment_status = Column(String, default="pending")  # "pending", "deposit_paid", "fully_paid"
    
    # Custom configurations
    options_selected = Column(JSON, nullable=True)  # JSON structure containing selected wizard configurations
    timeline = Column(String, nullable=False)  # e.g., "14 Days", "48 Hours"
    files_uploaded = Column(JSON, nullable=True)  # List of URLs/names of uploaded assets
    
    # Workflow status
    status = Column(String, default="pending")  # "pending", "requirements_received", "planning", "in_progress", "review", "revision", "completed", "delivered"
    
    # Resource assignment
    staff_assigned_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    client = relationship("User", back_populates="orders", foreign_keys=[client_id])
    staff_assigned = relationship("User", back_populates="assigned_tasks", foreign_keys=[staff_assigned_id])
    invoices = relationship("Invoice", back_populates="order")
    contracts = relationship("Contract", back_populates="order")
    tickets = relationship("SupportTicket", back_populates="order")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, index=True)  # e.g., "INV-12345"
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="unpaid")  # "unpaid", "paid", "refunded"
    due_date = Column(DateTime, nullable=False)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="invoices")

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String, primary_key=True, index=True)  # e.g., "CON-12345"
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    contract_text = Column(Text, nullable=False)
    signed_status = Column(Boolean, default=False)
    signed_at = Column(DateTime, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="contracts")

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    status = Column(String, default="open")  # "open", "in_progress", "resolved", "closed"
    messages = Column(JSON, nullable=True)  # Chat log history format: [{"sender": "client", "text": "...", "time": "..."}]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="tickets")
    client = relationship("User", back_populates="tickets")

class DiscountCode(Base):
    __tablename__ = "discount_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    percent_discount = Column(Float, nullable=False)
    active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=False)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, nullable=True)
    action = Column(String, nullable=False)  # e.g., "Created Order", "Assigned Task", "Updated Status"
    details = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
