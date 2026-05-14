import React from 'react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsDrawerOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1999,
          transition: 'opacity 0.3s'
        }}
      />
      
      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isDrawerOpen ? 0 : '-100%',
        width: 'min(400px, 100%)',
        height: '100%',
        background: '#121212',
        color: 'white',
        zIndex: 2000,
        transition: 'right 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        padding: '25px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Your Cart</h2>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '5px'
            }}
          >✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', opacity: 0.5 }}>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '15px', 
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.name}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', padding: '0 5px' }}
                  >-</button>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', padding: '0 5px' }}
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '18px', opacity: 0.8 }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{total}</span>
            </div>
            <button 
              onClick={() => {
                alert('Order placed successfully!');
                clearCart();
                setIsDrawerOpen(false);
              }}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '15px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
