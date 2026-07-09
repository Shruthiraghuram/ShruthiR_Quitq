import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, clearCart } from '../../services/CartServices';
import { addAddress, getAddressesByUser, updateAddress, deleteAddress } from '../../services/AddressService';
import { placeOrder } from '../../services/OrderService';
import { getUserId, isLoggedIn, logout } from '../../utils/AuthUtils';

const initialAddress = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const userId = getUserId();

  useEffect(() => {
    if (!isLoggedIn() || !userId) {
      logout();
      navigate('/login');
      return;
    }

    fetchCheckoutData();
  }, [navigate, userId]);

  const fetchCheckoutData = async () => {
    setLoading(true);
    setError('');

    try {
      const [cartResponse, addressResponse] = await Promise.all([
        getCartItems(userId),
        getAddressesByUser(userId),
      ]);

      const cartData = cartResponse.data;
      const items = Array.isArray(cartData) ? cartData : cartData?.items || [];
      setCartItems(items);

      const saved = Array.isArray(addressResponse.data) ? addressResponse.data : addressResponse.data?.addresses || [];
      setAddresses(saved || []);
      console.log(saved);
    } catch (err) {
      console.error('Failed to load checkout data', err);
      setError('Unable to load checkout data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    const id = address.addressId || address.id || address.address_id || address.address?.id;
    setEditingAddressId(null);
    setSelectedAddressId(id);
    setAddressForm({
      fullName: address.fullName || address.name || '',
      phone: address.phone || '',
      address: address.address || address.fullAddress || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || address.pincode || '',
      country: address.country || 'India',
    });
  };

  const handleEditAddress = (address) => {
  console.log("Address received:", address);

  const id = address.addressId || address.id;
  console.log("ID:", id);

  setEditingAddressId(id);

  setAddressForm({
    fullName: address.fullName || '',
    phone: address.phone || '',
    address: address.street || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.zipCode || '',
    country: address.country || 'India',
  });
  console.log(addressForm);

  console.log("Address form updated");
};

  const handleDeleteAddress = async (addressId) => {

    if (!window.confirm("Delete this address?")) return;

    try {

        await deleteAddress(addressId);

        await fetchCheckoutData();

        alert("Address deleted successfully!");

    } catch (err) {

        const message =
            err.response?.data ||
            "This address has already been used in an order and cannot be deleted.";

        alert(message);
    }
};

  const handleAddressChange = (field, value) => {
    setSelectedAddressId('');
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    if (!selectedAddressId) {
      if (!addressForm.fullName || !addressForm.phone || !addressForm.address) {
        setError('Please fill in your shipping address or select an existing address.');
        return false;
      }
    }
    return true;
  };

  const getAddressIdFromResponse = (responseData) => {
    if (!responseData) return null;
    if (typeof responseData === 'string' || typeof responseData === 'number') {
      return responseData;
    }
    return responseData.addressId || responseData.id || responseData.address?.id || responseData.address_id || null;
  };

  const handleSaveAddress = async () => {
     alert("SAVE BUTTON CLICKED");
    console.log("SAVE BUTTON CLICKED");
    console.log("editingAddressId =", editingAddressId);

    setAddressSaving(true);
    try {
      const payload = {
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        street: addressForm.address,
        city: addressForm.city,
        state: addressForm.state,
        zipCode: addressForm.postalCode,
        country: addressForm.country,
      };

      console.log("editingAddressId:", editingAddressId);
console.log("Payload:", payload);
console.log("editingAddressId =", editingAddressId);
console.log("Payload =", payload);

if (editingAddressId) {
    console.log("========== UPDATE ==========");
    console.log("Editing Address ID:", editingAddressId);
    console.log("Payload:", payload);

    const response = await updateAddress(editingAddressId, payload);

    console.log("Status:", response.status);
    console.log("Response:", response.data);

    alert("Address updated successfully!");
} else {
    console.log("========== ADD ==========");
    console.log("User ID:", userId);
    console.log("Payload:", payload);

    const response = await addAddress(userId, payload);

    console.log("Status:", response.status);
    console.log("Response:", response.data);

    alert("Address saved successfully!");
}

      await fetchCheckoutData();
      setAddressForm(initialAddress);
      setEditingAddressId(null);
    }  catch (err) {
    console.error("ERROR:", err);

    if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
    }

    alert("Unable to save address.");
}
  };
 

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      return;
    }

    if (cartItems.length === 0) {   
      setError('Your cart is empty. Add items before checking out.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let addressId = selectedAddressId;

      if (!addressId) {
        const addressPayload = {
  street: addressForm.address,
  city: addressForm.city,
  state: addressForm.state,
  zipCode: addressForm.postalCode,
  country: addressForm.country,
};

const response = await addAddress(userId, addressPayload);
addressId = getAddressIdFromResponse(response.data);
      }

      if (!addressId) {
        throw new Error('Unable to determine shipping address ID.');
      }

      const orderResponse = await placeOrder(userId, addressId, paymentMethod);
      const orderData = orderResponse.data;

      await clearCart(userId);
      navigate('/order-success', { state: { order: orderData } });
    } catch (err) {
      console.error('Checkout failed', err);
      setError('Unable to place your order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const product = item.product || item;
    const price = Number(item.price ?? product.price ?? 0);
    const quantity = Number(item.quantity ?? item.qty ?? 1);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">Checkout</h4>
          <p className="text-muted mb-0">Enter shipping details, choose payment, and place your order.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/cart')}>
          Back to Cart
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading checkout details...</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Shipping Address</h5>
                {addresses.length > 0 && (
                  <div className="mb-4">
                    <div className="small text-uppercase text-muted mb-2">Saved addresses</div>
                    <div className="row g-3">
                      {addresses.map((address) => {
                        const id = address.addressId || address.id || address.address_id || address.address?.id;
                        const addressLabel = `${address.street}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`; // fallback
                        return (
                          <div className="col-12" key={id}>
                            <div className={`card ${selectedAddressId === id ? 'border-primary' : 'border-light'}`}>
                              <div className="card-body p-3 d-flex justify-content-between align-items-start gap-3">
                                <div>
                                  <div className="fw-semibold mb-1">{address.fullName || address.name || 'Shipping address'}</div>
                                  <p className="mb-1 small text-muted">{address.phone || 'No phone provided'}</p>
                                  <p className="mb-0 small">{addressLabel}</p>
                                </div>
                                <div className="d-flex flex-column align-items-end gap-2">
                                  <div className="form-check mt-2">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="savedAddress"
                                      id={`address-${id}`}
                                      checked={selectedAddressId === id}
                                      onChange={() => handleSelectAddress(address)}
                                    />
                                  </div>
                                  <div className="d-flex gap-2 mt-1">
                                    <button
    type="button"
    className="btn btn-sm btn-outline-secondary"
    onClick={() => {
        console.log("EDIT BUTTON CLICKED");
        handleEditAddress(address);
    }}
>
    Edit
</button>
                                    <button
  type="button"
  className="btn btn-sm btn-outline-danger"
  onClick={() => handleDeleteAddress(id)}
>
  Delete
</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <div className="small text-uppercase text-muted mb-2">Add a new address</div>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Full name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={addressForm.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={addressForm.address}
                        onChange={(e) => handleAddressChange('address', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Postal code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addressForm.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                      />
                    </div>
                    <div className="col-12 mt-3">
                    <button
  type="button"
  className="btn btn-outline-primary"
  onClick={handleSaveAddress}
  disabled={addressSaving}
>
  {editingAddressId ? "Update Address" : "Save Address"}
</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Payment method</h5>
                <div className="form-check mb-2">
                  <input
                    id="cod"
                    name="paymentMethod"
                    className="form-check-input"
                    type="radio"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    id="upi"
                    name="paymentMethod"
                    className="form-check-input"
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="upi">
                    UPI
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    id="card"
                    name="paymentMethod"
                    className="form-check-input"
                    type="radio"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="card">
                    Card
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items</span>
                  <strong>{cartItems.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total</span>
                  <strong>₹{cartTotal.toLocaleString()}</strong>
                </div>
                <div className="list-group mb-4">
                  {cartItems.map((item) => {
                    const product = item.product || item;
                    const price = Number(item.price ?? product.price ?? 0);
                    const quantity = Number(item.quantity ?? item.qty ?? 1);
                    return (
                      <div key={item.cartItemId || item.id || product.productId || product.id} className="list-group-item px-0 border-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{product.productName || product.name || 'Product'}</div>
                            <div className="small text-muted">Qty {quantity}</div>
                          </div>
                          <div className="text-end">
                            <div>₹{(price * quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={saving || cartItems.length === 0}
                >
                  {saving ? 'Placing order...' : 'Place Order'}
                </button>
                <p className="text-muted small mt-3">
                  Your order will be placed using the selected shipping address and payment method.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
