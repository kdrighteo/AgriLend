import React, { useState } from 'react';
import '../styles/LoanComparison.css';

interface LoanOption {
  id: string;
  name: string;
  principal: string;
  annualRate: string;
  years: string;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

const LoanComparison: React.FC = () => {
  const [loans, setLoans] = useState<LoanOption[]>([
    {
      id: '1',
      name: 'Loan Option A',
      principal: '10000',
      annualRate: '12',
      years: '1',
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    },
    {
      id: '2',
      name: 'Loan Option B',
      principal: '10000',
      annualRate: '10',
      years: '2',
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    }
  ]);

  const [showDetails, setShowDetails] = useState(false);

  const calculateLoan = (principal: number, annualRate: number, years: number) => {
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;

    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return { monthlyPayment, totalPayment, totalInterest };
  };

  const handleLoanChange = (loanId: string, field: keyof LoanOption, value: string) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId) {
        const updated = { ...loan, [field]: value };
        const principal = parseFloat(updated.principal) || 0;
        const annualRate = parseFloat(updated.annualRate) || 0;
        const years = parseFloat(updated.years) || 0;
        
        const calculated = calculateLoan(principal, annualRate, years);
        
        return {
          ...updated,
          ...calculated
        };
      }
      return loan;
    }));
  };

  const addLoanOption = () => {
    const newId = (loans.length + 1).toString();
    setLoans([...loans, {
      id: newId,
      name: `Loan Option ${String.fromCharCode(65 + loans.length)}`,
      principal: '10000',
      annualRate: '12',
      years: '1',
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0
    }]);
  };

  const removeLoanOption = (loanId: string) => {
    if (loans.length > 1) {
      setLoans(loans.filter(loan => loan.id !== loanId));
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getBestOption = (field: 'monthlyPayment' | 'totalPayment' | 'totalInterest') => {
    const values = loans.map(loan => loan[field]);
    const min = Math.min(...values);
    return loans.filter(loan => loan[field] === min);
  };

  const bestMonthly = getBestOption('monthlyPayment');
  const bestTotal = getBestOption('totalPayment');
  const bestInterest = getBestOption('totalInterest');

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2>🔍 Loan Comparison Tool</h2>
        <p>Compare different loan options to find the best fit for your needs</p>
      </div>

      <div className="comparison-content">
        <div className="loans-grid">
          {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <div className="loan-card-header">
                <input
                  type="text"
                  value={loan.name}
                  onChange={(e) => handleLoanChange(loan.id, 'name', e.target.value)}
                  className="loan-name-input"
                />
                {loans.length > 1 && (
                  <button
                    onClick={() => removeLoanOption(loan.id)}
                    className="remove-loan-btn"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="loan-inputs">
                <div className="input-group">
                  <label>Loan Amount</label>
                  <input
                    type="number"
                    value={loan.principal}
                    onChange={(e) => handleLoanChange(loan.id, 'principal', e.target.value)}
                    min="100"
                    step="100"
                  />
                </div>

                <div className="input-group">
                  <label>Interest Rate (%)</label>
                  <input
                    type="number"
                    value={loan.annualRate}
                    onChange={(e) => handleLoanChange(loan.id, 'annualRate', e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>

                <div className="input-group">
                  <label>Term (Years)</label>
                  <input
                    type="number"
                    value={loan.years}
                    onChange={(e) => handleLoanChange(loan.id, 'years', e.target.value)}
                    min="1"
                    max="10"
                    step="1"
                  />
                </div>
              </div>

              <div className="loan-results">
                <div className={`result-item ${bestMonthly.some(l => l.id === loan.id) ? 'best' : ''}`}>
                  <div className="result-label">Monthly Payment</div>
                  <div className="result-value">{formatCurrency(loan.monthlyPayment)}</div>
                  {bestMonthly.some(l => l.id === loan.id) && (
                    <div className="best-badge">Best</div>
                  )}
                </div>

                <div className={`result-item ${bestTotal.some(l => l.id === loan.id) ? 'best' : ''}`}>
                  <div className="result-label">Total Payment</div>
                  <div className="result-value">{formatCurrency(loan.totalPayment)}</div>
                  {bestTotal.some(l => l.id === loan.id) && (
                    <div className="best-badge">Best</div>
                  )}
                </div>

                <div className={`result-item ${bestInterest.some(l => l.id === loan.id) ? 'best' : ''}`}>
                  <div className="result-label">Total Interest</div>
                  <div className="result-value">{formatCurrency(loan.totalInterest)}</div>
                  {bestInterest.some(l => l.id === loan.id) && (
                    <div className="best-badge">Best</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addLoanOption} className="add-loan-btn">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Another Loan Option
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="toggle-details-btn"
        >
          {showDetails ? 'Hide' : 'Show'} Detailed Comparison
        </button>

        {showDetails && (
          <div className="detailed-comparison">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {loans.map(loan => (
                    <th key={loan.id}>{loan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Loan Amount</td>
                  {loans.map(loan => (
                    <td key={loan.id}>{formatCurrency(parseFloat(loan.principal) || 0)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Interest Rate</td>
                  {loans.map(loan => (
                    <td key={loan.id}>{loan.annualRate}%</td>
                  ))}
                </tr>
                <tr>
                  <td>Loan Term</td>
                  {loans.map(loan => (
                    <td key={loan.id}>{loan.years} years</td>
                  ))}
                </tr>
                <tr>
                  <td>Monthly Payment</td>
                  {loans.map(loan => (
                    <td key={loan.id} className={bestMonthly.some(l => l.id === loan.id) ? 'best-cell' : ''}>
                      {formatCurrency(loan.monthlyPayment)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Total Payment</td>
                  {loans.map(loan => (
                    <td key={loan.id} className={bestTotal.some(l => l.id === loan.id) ? 'best-cell' : ''}>
                      {formatCurrency(loan.totalPayment)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Total Interest</td>
                  {loans.map(loan => (
                    <td key={loan.id} className={bestInterest.some(l => l.id === loan.id) ? 'best-cell' : ''}>
                      {formatCurrency(loan.totalInterest)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanComparison;
