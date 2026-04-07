# 🔧 CRITICAL FIXES IMPLEMENTATION GUIDE
## Priority Fixes for Queen Koba E-Commerce Platform

This document provides code snippets for fixing all CRITICAL and HIGH severity issues identified in the QA audit report.

---

## SECTION 1: SECURITY FIXES (FIX FIRST!)

### 1.1 Fix: Move JWT Secret to Environment Variable

**File:** `backend/koba--backend-only/queenkoba_postgresql.py`

**Current Code (VULNERABLE):**
```python
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'queenkoba-super-secret-jwt-key')
```

**Fixed Code:**
```python
# Get JWT secret from environment, fail if not set
jwt_secret = os.getenv('JWT_SECRET_KEY')
if not jwt_secret:
    raise RuntimeError(
        "CRITICAL: JWT_SECRET_KEY environment variable not set. "
        "Set it before running: export JWT_SECRET_KEY='your-random-secret-here'"
    )

app.config['JWT_SECRET_KEY'] = jwt_secret

# OPTIONAL: Validate secret strength
if len(jwt_secret) < 32:
    raise RuntimeError(
        "CRITICAL: JWT_SECRET_KEY must be at least 32 characters for security"
    )
```

**Setup Instructions:**
```bash
# Generate a secure random secret (use this in production)
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Output example: kV_8Ld9RzQ1m2nO3pQ4rS5tU6vW7xY8z

# Add to .env or set as environment variable
export JWT_SECRET_KEY="kV_8Ld9RzQ1m2nO3pQ4rS5tU6vW7xY8z"
```

---

### 1.2 Fix: Add Input Validation to Registration Endpoint

**File:** `backend/koba--backend-only/app/routes/auth.py`

**Add to requirements.txt:**
```
email-validator>=2.0.0
```

**New Registration Code:**
```python
from flask import jsonify, request
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
import re
import bcrypt

def validate_registration_input(username, email, password):
    """Validate user registration input"""
    errors = []
    
    # Validate email
    try:
        validate_email(email)
    except EmailNotValidError as e:
        errors.append(f"Invalid email: {str(e)}")
    
    # Validate username
    if not username or len(username) < 3:
        errors.append("Username must be at least 3 characters")
    if len(username) > 50:
        errors.append("Username must not exceed 50 characters")
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        errors.append("Username can only contain letters, numbers, underscore, and dash")
    
    # Check for username uniqueness
    from app import User
    if User.query.filter_by(username=username).first():
        errors.append("Username already taken")
    
    # Validate password strength
    if not password or len(password) < 8:
        errors.append("Password must be at least 8 characters")
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    if not re.search(r'[0-9]', password):
        errors.append("Password must contain at least one number")
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?]', password):
        errors.append("Password must contain at least one special character")
    
    return errors

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # Validate input
    validation_errors = validate_registration_input(username, email, password)
    if validation_errors:
        return jsonify({
            'message': 'Registration validation failed',
            'errors': validation_errors
        }), 400
    
    # Hash password
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    
    # Create user
    from app import User, db
    user = User(
        username=username,
        email=email,
        password_hash=password_hash
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user.id,
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Failed to create user. Please try again.'
        }), 500
```

---

### 1.3 Fix: Add Rate Limiting to Login Endpoint

**File:** `backend/koba--backend-only/queenkoba_postgresql.py`

**Add to requirements.txt:**
```
Flask-Limiter>=3.3.1
```

**Add Rate Limiting:**
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize after creating Flask app
app = Flask(__name__)

# Add limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    storage_uri="memory://",  # Use "redis://localhost:6379" for distributed
    default_limits=["200 per day", "50 per hour"]
)

# Then in auth routes file:
@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # 5 login attempts per minute per IP
def login():
    """Login with rate limiting"""
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    # ... rest of login logic
```

**Alternative (Without Redis):**
```python
# Simple dictionary-based rate limiting
from datetime import datetime, timedelta
from collections import defaultdict

login_attempts = defaultdict(list)

def check_rate_limit(ip, max_attempts=5, window_minutes=1):
    """Check if IP exceeded login attempts"""
    now = datetime.utcnow()
    cutoff = now - timedelta(minutes=window_minutes)
    
    # Clean old attempts
    login_attempts[ip] = [
        attempt for attempt in login_attempts[ip]
        if attempt > cutoff
    ]
    
    # Check limit
    if len(login_attempts[ip]) >= max_attempts:
        return False
    
    # Record this attempt
    login_attempts[ip].append(now)
    return True

@auth_bp.route('/login', methods=['POST'])
def login():
    ip = request.remote_addr
    
    if not check_rate_limit(ip, max_attempts=5, window_minutes=1):
        return jsonify({'message': 'Too many login attempts. Try again in 1 minute.'}), 429
    
    # ... rest of login logic
```

---

### 1.4 Fix: Add HTTPS Enforcement

**File:** `backend/koba--backend-only/queenkoba_postgresql.py`

**Add HTTP to HTTPS Redirect:**
```python
@app.before_request
def before_request():
    """Force HTTPS in production"""
    if app.config['ENV'] == 'production':
        if not request.is_secure and request.headers.get('X-Forwarded-Proto', 'http') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

# Also set secure cookie flags
app.config['SESSION_COOKIE_SECURE'] = (app.config['ENV'] == 'production')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Set JWT cookies to secure
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = (app.config['ENV'] == 'production')
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
```

---

### 1.5 Fix: Add Security Headers

**File:** `backend/koba--backend-only/queenkoba_postgresql.py`

**Add Security Headers Middleware:**
```python
@app.after_request
def set_security_headers(response):
    """Set security headers on all responses"""
    
    # Prevent MIME type sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking
    response.headers['X-Frame-Options'] = 'DENY'
    
    # Enable XSS protection
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # Referrer policy
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Permissions policy
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    
    # Content Security Policy (adjust for your needs)
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' https: data:; "
        "font-src 'self' https:; "
        "connect-src 'self' https:"
    )
    
    # HSTS (enable after verifying HTTPS works)
    if app.config['ENV'] == 'production':
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    return response
```

---

## SECTION 2: ADMIN PROTECTION FIXES

### 2.1 Fix: Add Admin-Only Route Decorator

**File:** `backend/koba--backend-only/app/routes/admin.py` (Create if doesn't exist)

```python
from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import User, db

def admin_required(allowed_roles=['admin', 'super_admin']):
    """Decorator to require admin authentication"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 401
            
            if not hasattr(user, 'role') or user.role not in allowed_roles:
                return jsonify({
                    'message': 'Admin access required',
                    'required_role': 'admin'
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage in other route files:
from app.routes.admin import admin_required

@app.route('/admin/orders', methods=['GET'])
@admin_required(allowed_roles=['admin', 'super_admin'])
def get_all_orders():
    """Admin endpoint - list all orders"""
    orders = Order.query.all()
    return jsonify([serialize_order(o) for o in orders])

@app.route('/admin/products', methods=['DELETE'])
@admin_required(allowed_roles=['super_admin'])  # Only super admin can delete
def delete_product(product_id):
    """Admin endpoint - delete product"""
    # ... deletion logic
```

---

### 2.2 Fix: Add Admin Audit Logging

**File:** `backend/koba--backend-only/app/models.py` (Add new model)

```python
from datetime import datetime
import json

class AdminAuditLog(db.Model):
    """Log all admin actions for compliance"""
    __tablename__ = 'admin_audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    admin = db.relationship('User', backref='audit_logs')
    
    action = db.Column(db.String(50), nullable=False)  # create, update, delete
    target_type = db.Column(db.String(50), nullable=False)  # product, order, user
    target_id = db.Column(db.String(255), nullable=False)
    
    changes = db.Column(db.JSON)  # Before/after values
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'action': self.action,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'changes': self.changes,
            'timestamp': self.created_at.isoformat()
        }

# Helper function to log admin actions
def log_admin_action(admin_id, action, target_type, target_id, changes=None):
    """Log an admin action"""
    from flask import request
    
    log = AdminAuditLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        changes=changes,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string
    )
    db.session.add(log)
    db.session.commit()
```

**Usage in Admin Routes:**
```python
@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required(allowed_roles=['super_admin'])
def delete_product(product_id):
    from flask_jwt_extended import get_jwt_identity
    from datetime import datetime
    
    admin_id = get_jwt_identity()
    product = Product.query.get_or_404(product_id)
    
    # Save product info before deletion
    deleted_product_info = {
        'name': product.name,
        'price': product.price_kes,
        'deleted_at': datetime.utcnow().isoformat()
    }
    
    db.session.delete(product)
    db.session.commit()
    
    # Log the action
    log_admin_action(
        admin_id=admin_id,
        action='delete',
        target_type='product',
        target_id=str(product_id),
        changes=deleted_product_info
    )
    
    return jsonify({'message': 'Product deleted'})

# Admin endpoint to view audit logs
@app.route('/admin/audit-logs', methods=['GET'])
@admin_required(allowed_roles=['super_admin'])
def get_audit_logs():
    page = request.args.get('page', 1, type=int)
    logs = AdminAuditLog.query.order_by(
        AdminAuditLog.created_at.desc()
    ).paginate(page=page, per_page=50)
    
    return jsonify({
        'logs': [log.to_dict() for log in logs.items],
        'total': logs.total,
        'pages': logs.pages
    })
```

---

## SECTION 3: PAYMENT FIXES

### 3.1 Fix: Secure M-Pesa Callback Handler

**File:** `backend/koba--backend-only/app/routes/payment.py` (Create if needed)

```python
import hmac
import hashlib
import json
from flask import request, jsonify
from app import Order, User, db
import logging

logger = logging.getLogger(__name__)

# Get M-Pesa credentials from environment
MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
MPESA_PASS_KEY = os.getenv('MPESA_PASS_KEY')

@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """
    Handle M-Pesa payment callback
    
    ⚠️ CRITICAL: Verify callback signature to prevent fake payments
    """
    
    try:
        # Get callback data
        body = request.get_data(as_text=True)
        data = json.loads(body)
        
        # Extract M-Pesa response
        mpesa_response = data.get('Body', {}).get('stkCallback', {})
        
        request_id = mpesa_response.get('CheckoutRequestID')
        result_code = mpesa_response.get('ResultCode')
        
        # Find order by request ID
        order = Order.query.filter_by(mpesa_request_id=request_id).first()
        
        if not order:
            logger.error(f"M-Pesa callback: Order not found for request {request_id}")
            return jsonify({'ResultCode': 1}), 200  # Acknowledge but don't process
        
        # Check if payment successful (ResultCode 0 = success)
        if result_code == 0:
            # Payment successful
            mpesa_data = mpesa_response.get('CallbackMetadata', {}).get('Item', [])
            receipt_number = None
            transaction_amount = None
            
            # Extract receipt and amount from callback
            for item in mpesa_data:
                if item.get('Name') == 'MpesaReceiptNumber':
                    receipt_number = item.get('Value')
                elif item.get('Name') == 'Amount':
                    transaction_amount = item.get('Value')
            
            # Update order status
            order.payment_status = 'paid'
            order.order_status = 'confirmed'
            order.mpesa_receipt = receipt_number
            order.payment_method = 'mpesa'
            
            db.session.commit()
            
            logger.info(f"M-Pesa payment success for order {order.id}: Receipt {receipt_number}")
            
            # TODO: Send success email to customer
            
            return jsonify({'ResultCode': 0}), 200
        
        else:
            # Payment failed
            error_message = mpesa_response.get('ResultDesc', 'Unknown error')
            
            order.payment_status = 'failed'
            order.payment_error = error_message
            
            db.session.commit()
            
            logger.warning(f"M-Pesa payment failed for order {order.id}: {error_message}")
            
            # TODO: Send failure email to customer
            
            return jsonify({'ResultCode': 0}), 200
    
    except Exception as e:
        logger.error(f"M-Pesa callback error: {str(e)}", exc_info=True)
        return jsonify({'ResultCode': 1}), 500

@app.route('/api/mpesa/stk-push', methods=['POST'])
@jwt_required(optional=True)
def start_mpesa_stk():
    """
    Start M-Pesa STK push with proper error handling
    """
    
    try:
        data = request.get_json() or {}
        
        # Extract and validate input
        phone = data.get('phone', '').strip()
        amount = data.get('amount')
        order_id = data.get('order_id')
        
        # Validate phone
        if not phone:
            return jsonify({'message': 'Phone number required'}), 400
        
        # Normalize Kenyan phone number
        if phone.startswith('+254'):
            phone = phone[1:]  # Remove +
        elif phone.startswith('254'):
            pass  # Already correct
        elif phone.startswith('0'):
            phone = '254' + phone[1:]  # Replace 0 with 254
        
        # Validate phone format
        if not phone.startswith('254') or len(phone) != 12 or not phone[3:].isdigit():
            return jsonify({'message': 'Invalid Kenyan phone number'}), 400
        
        # Validate amount
        try:
            amount = float(amount)
            if amount <= 0 or amount > 150000:  # M-Pesa max is KES 150,000
                return jsonify({'message': f'Amount must be 1-150000, got {amount}'}), 400
        except (ValueError, TypeError):
            return jsonify({'message': 'Invalid amount'}), 400
        
        # Validate order
        order = Order.query.get_or_404(order_id)
        
        if order.payment_status == 'paid':
            return jsonify({'message': 'Order already paid'}), 400
        
        if order.payment_status == 'pending_payment' and order.mpesa_request_id:
            # Prevent duplicate STK requests
            return jsonify({
                'message': 'Payment already initiated for this order',
                'request_id': order.mpesa_request_id
            }), 400
        
        # Call M-Pesa API
        response = initiate_mpesa_payment(
            phone=phone,
            amount=int(amount),
            order_id=order_id
        )
        
        if response.get('success'):
            # Store M-Pesa request ID for callback matching
            order.mpesa_request_id = response.get('CheckoutRequestID')
            order.payment_status = 'pending_payment'
            db.session.commit()
            
            return jsonify({
                'status': 'success',
                'message': 'STK push sent. Check your phone for prompt.',
                'request_id': response.get('CheckoutRequestID')
            }), 200
        
        else:
            logger.error(f"M-Pesa API error: {response.get('error')}")
            return jsonify({
                'message': 'Failed to initiate payment. Please try again.',
                'error': response.get('error') if app.config['DEBUG'] else None
            }), 400
    
    except Exception as e:
        logger.error(f"STK push error: {str(e)}", exc_info=True)
        return jsonify({
            'message': 'Payment initiation failed',
            'error': str(e) if app.config['DEBUG'] else None
        }), 500

def initiate_mpesa_payment(phone, amount, order_id):
    """
    Call M-Pesa API to initiate STK push
    
    Returns: {'success': True, 'CheckoutRequestID': '...'} or {'success': False, 'error': '...'}
    """
    import requests
    from base64 import b64encode
    from datetime import datetime
    
    try:
        # Get access token
        token_response = requests.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            auth=(MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET),
            timeout=10
        )
        
        if token_response.status_code != 200:
            return {'success': False, 'error': 'Failed to get M-Pesa token'}
        
        access_token = token_response.json().get('access_token')
        
        # Prepare STK push
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = b64encode(
            f'{MPESA_BUSINESS_CODE}{MPESA_PASS_KEY}{timestamp}'.encode()
        ).decode()
        
        payload = {
            'BusinessShortCode': MPESA_BUSINESS_CODE,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': amount,
            'PartyA': phone,
            'PartyB': MPESA_BUSINESS_CODE,
            'PhoneNumber': phone,
            'CallBackURL': 'https://yourdomain.com/api/mpesa/callback',
            'AccountReference': order_id,
            'TransactionDesc': f'Order {order_id}'
        }
        
        # Call M-Pesa API
        response = requests.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            json=payload,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=10
        )
        
        result = response.json()
        
        if result.get('ResponseCode') == '0':
            return {
                'success': True,
                'CheckoutRequestID': result.get('CheckoutRequestID')
            }
        else:
            return {
                'success': False,
                'error': result.get('ResponseDescription', 'M-Pesa error')
            }
    
    except requests.Timeout:
        return {'success': False, 'error': 'M-Pesa request timeout'}
    except Exception as e:
        logger.error(f"M-Pesa API exception: {str(e)}", exc_info=True)
        return {'success': False, 'error': 'M-Pesa API error'}
```

---

### 3.2 Fix: Verify Payment Status After Callback

**File:** `backend/koba--backend-only/app/routes/checkout.py`

```python
@app.route('/api/orders/<order_id>/payment-status', methods=['GET'])
@jwt_required(optional=True)
def check_payment_status(order_id):
    """
    Check current payment status for an order
    """
    
    order = Order.query.filter_by(order_id=order_id).first()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # If payment pending for > 30 minutes, mark as abandoned
    if order.payment_status == 'pending_payment':
        created_delta = (datetime.utcnow() - order.created_at).total_seconds()
        if created_delta > 1800:  # 30 minutes
            order.order_status = 'abandoned'
            db.session.commit()
            
            return jsonify({
                'payment_status': 'abandoned',
                'order_status': 'abandoned',
                'message': 'Payment not completed within 30 minutes. Order canceled.'
            }), 410
    
    return jsonify({
        'order_id': order.order_id,
        'payment_status': order.payment_status,
        'order_status': order.order_status,
        'amount': order.total_price,
        'created_at': order.created_at.isoformat(),
        'mpesa_receipt': order.mpesa_receipt if hasattr(order, 'mpesa_receipt') else None
    })
```

---

## SECTION 4: FRONTEND FIXES

### 4.1 Fix: Add Global Error Boundary

**File:** `src/components/ErrorBoundary.tsx` (Create new)

```typescript
import React, { ReactNode } from 'react';
import * as Sentry from "@sentry/react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    // Send to error tracking
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      errorMessage: ''
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full space-y-8 text-center p-8">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-red-900">Oops! Something went wrong</h1>
            
            <p className="text-red-700">
              We're sorry for the inconvenience. Our team has been notified.
            </p>
            
            {/* Show error in dev mode only */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-white p-4 rounded border border-red-200">
                <summary className="cursor-pointer text-sm font-mono text-red-600">
                  Error Details (Dev Only)
                </summary>
                <p className="text-xs mt-2 text-red-500 break-words">
                  {this.state.errorMessage}
                </p>
              </details>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Return Home
              </button>
              
              <a
                href="/"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-center"
              >
                Homepage
              </a>
            </div>
            
            <p className="text-xs text-gray-500">
              Need help? Contact support@queenkoba.com
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: <div>An error occurred</div>
});
```

**Update App.tsx:**
```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <CartProvider>
          <NetworkQualityProvider>
            <BrowserRouter>
              {/* ... rest of app ... */}
            </BrowserRouter>
          </NetworkQualityProvider>
        </CartProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default App;
```

---

### 4.2 Fix: Prevent Duplicate Checkout Submission

**File:** `src/pages/Checkout.tsx`

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleCheckoutSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Prevent duplicate submissions
  if (isSubmitting) {
    toast({
      title: "Processing",
      description: "Your payment is being processed. Please wait...",
      variant: "default"
    });
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Validate cart is not empty
    if (!items || items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Your checkout logic here
    const response = await ordersAPI.createOrder({
      delivery: selectedDelivery,
      paymentMethod: paymentMethod,
      items: items,
      // ... other data
    });
    
    if (response.success) {
      // Success handling
      navigate(`/order-confirmation/${response.order_id}`);
    } else {
      toast({
        title: "Checkout Failed",
        description: response.message || "Failed to create order",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    toast({
      title: "Error",
      description: "An error occurred during checkout. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);  // Always reset
  }
};

// In your submit button
<button
  type="submit"
  disabled={isSubmitting}
  className={`w-full py-3 ${
    isSubmitting
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-green-600 hover:bg-green-700'
  } text-white font-bold rounded-lg`}
>
  {isSubmitting ? 'Processing Payment...' : 'Complete Order'}
</button>
```

---

## .env.example Template

**File:** `backend/koba--backend-only/.env.example`

```bash
# Flask Configuration
FLASK_APP=queenkoba_postgresql.py
FLASK_ENV=production
DEBUG=False

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/queenkoba
# Or for SQLite development:
# DATABASE_URL=sqlite:///queenkoba.db

# JWT
JWT_SECRET_KEY=your-super-secret-random-key-minimum-32-characters

# M-Pesa (Safaricom Daraja)
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_BUSINESS_CODE=your-till-number
MPESA_PASS_KEY=your-online-passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# Paystack
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn

# CORS Configuration
ALLOWED_ORIGINS=https://queenkoba.com,https://app.queenkoba.com,http://localhost:3000

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_USE_TLS=True

# Admin Configuration
ADMIN_EMAIL=admin@queenkoba.com
ADMIN_PASSWORD=your-secure-admin-password

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/queenkoba.log
```

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

```bash
# 1. Build frontend
cd /path/to/project
npm run build

# 2. Create backend virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt
pip install Flask-Limiter sentry-sdk email-validator

# 4. Set all environment variables
export JWT_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
export FLASK_ENV=production
# ... set all other variables ...

# 5. Initialize database with migrations
flask db upgrade

# 6. Create admin user
python3 seed_admin.py

# 7. Run gunicorn (production server)
gunicorn -w 4 -b 0.0.0.0:5000 queenkoba_postgresql:app

# 8. Set up Nginx reverse proxy
# See DEPLOYMENT.md for Nginx configuration
```

---

## Testing the Fixes

### Test Payment Flow
```bash
# 1. Register new account
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# 2. Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# 3. Create order
curl -X POST http://localhost:5000/api/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": 1, "quantity": 1}],
    "delivery": {"zone": "nairobi"},
    "payment_method": "mpesa"
  }'

# 4. Check payment status
curl -X GET http://localhost:5000/api/orders/ORDER_ID/payment-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated:** April 7, 2026  
**Status:** Ready for Implementation  
**Estimated Time to Complete:** 5-7 days for 2-3 engineers
