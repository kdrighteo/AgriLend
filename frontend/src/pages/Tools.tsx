import React from 'react';
import LoanCalculator from '../components/LoanCalculator';
import LoanComparison from '../components/LoanComparison';
import '../styles/Tools.css';

const Tools: React.FC = () => {
  return (
    <div className="tools-container">
      <div className="tools-header">
        <h1>🛠️ Financial Tools</h1>
        <p>Use our calculators and comparison tools to make informed decisions</p>
      </div>

      <div className="tools-content">
        <LoanCalculator />
        <LoanComparison />
      </div>
    </div>
  );
};

export default Tools;
