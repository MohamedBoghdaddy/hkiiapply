import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PaymentHistory.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    plan: "",
    paymentMethod: "",
    paymentStatus: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    axios
      .get("/api/payments", { params: filters })
      .then((response) => setPayments(response.data))
      .catch((error) => console.error("Error fetching payments:", error));
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="payment-history">
      <h1>Payment History</h1>
      <div className="filters">
        <input
          type="text"
          name="plan"
          placeholder="Plan"
          value={filters.plan}
          onChange={handleFilterChange}
        />
        {/* Other filter inputs */}
      </div>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.plan}</td>
              <td>{payment.amount}</td>
              <td>{payment.method}</td>
              <td>{payment.status}</td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
