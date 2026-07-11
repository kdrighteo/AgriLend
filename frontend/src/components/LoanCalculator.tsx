import React, { useState, useEffect } from 'react';
import '../styles/LoanCalculator.css';

interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface CalculatorState {
  principal: string;
  annualRate: string;
  years: string;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationEntry[];
}

const LoanCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    principal: '10000',
    annualRate: '12',
    years: '1',
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    amortizationSchedule: []
  });

  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    calculateLoan();
  }, [state.principal, state.annualRate, state.years]);

  const calculateLoan = () => {
    const principal = parseFloat(state.principal) || 0;
    const annualRate = parseFloat(state.annualRate) || 0;
    const years = parseFloat(state.years) || 0;

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      setState(prev => ({
        ...prev,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        amortizationSchedule: []
      }));
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    // Calculate monthly payment using amortization formula
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        period: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setState(prev => ({
      ...prev,
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule
    }));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>🌾 Loan Calculator</h2>
        <p>Calculate your agricultural loan payments and view amortization schedule</p>
      </div>

      <div className="calculator-content">
        <div className="calculator-inputs">
          <div className="input-group">
            <label htmlFor="principal">Loan Amount (USD)</label>
            <input
              type="number"
              id="principal"
              name="principal"
              value={state.principal}
              onChange={handleInputChange}
              min="100"
              step="100"
              placeholder="10000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="annualRate">Annual Interest Rate (%)</label>
            <input
              type="number"
              id="annualRate"
              name="annualRate"
              value={state.annualRate}
              onChange={handleInputChange}
              min="0.1"
              step="0.1"
              placeholder="12"
            />
          </div>

          <div className="input-group">
            <label htmlFor="years">Loan Term (Years)</label>
            <input
              type="number"
              id="years"
              name="years"
              value={state.years}
              onChange={handleInputChange}
              min="1"
              max="10"
              step="1"
              placeholder="1"
            />
          </div>
        </div>

        <div className="calculator-results">
          <div className="result-card">
            <div className="result-label">Monthly Payment</div>
            <div className="result-value primary">{formatCurrency(state.monthlyPayment)}</div>
          </div>

          <div className="result-card">
            <div className="result-label">Total Payment</div>
            <div className="result-value">{formatCurrency(state.totalPayment)}</div>
          </div>

          <div className="result-card">
            <div className="result-label">Total Interest</div>
            <div className="result-value accent">{formatCurrency(state.totalInterest)}</div>
          </div>
        </div>

        <button
          className="toggle-schedule-btn"
          onClick={() => setShowSchedule(!showSchedule)}
        >
          {showSchedule ? 'Hide' : 'View'} Amortization Schedule
        </button>

        {showSchedule && (
          <div className="amortization-schedule">
            <h3>Amortization Schedule</h3>
            <div className="schedule-table-container">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {state.amortizationSchedule.map((entry) => (
                    <tr key={entry.period}>
                      <td>{entry.period}</td>
                      <td>{formatCurrency(entry.payment)}</td>
                      <td>{formatCurrency(entry.principal)}</td>
                      <td>{formatCurrency(entry.interest)}</td>
                      <td>{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
