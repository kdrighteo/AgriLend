const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send loan status update email
const sendLoanStatusEmail = async (userEmail, userName, loanDetails, status) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      pending: 'Your loan application has been received and is pending review.',
      approved: 'Congratulations! Your loan application has been approved.',
      rejected: 'We regret to inform you that your loan application has been rejected.',
      under_review: 'Your loan application is currently under review.',
      disbursed: 'Your loan has been disbursed to your account.',
      repaid: 'Your loan has been fully repaid. Thank you for your business!'
    };

    const subject = `AgricLend - Loan Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .loan-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: 600; color: #1f2937; }
          .detail-value { color: #4b5563; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; text-transform: uppercase; font-size: 12px; margin-top: 10px; }
          .status-approved { background-color: #d1fae5; color: #065f46; }
          .status-rejected { background-color: #fee2e2; color: #b91c1c; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-under_review { background-color: #dbeafe; color: #1e40af; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 AgricLend</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>${statusMessages[status] || `Your loan status has been updated to: ${status}`}</p>
            
            <div class="loan-details">
              <h3>Loan Application Details</h3>
              <div class="detail-row">
                <span class="detail-label">Application ID:</span>
                <span class="detail-value">${loanDetails._id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Loan Amount:</span>
                <span class="detail-value">$${loanDetails.amount?.toLocaleString() || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Purpose:</span>
                <span class="detail-value">${loanDetails.purpose || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Term:</span>
                <span class="detail-value">${loanDetails.termLength || 'N/A'} ${loanDetails.termUnit || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Current Status:</span>
                <span class="detail-value">
                  <span class="status-badge status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </span>
              </div>
            </div>
            
            <p>If you have any questions about your loan application, please don't hesitate to contact our support team.</p>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AgricLend. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"AgricLend" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .cta-button { display: inline-block; background-color: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 Welcome to AgricLend</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to AgricLend! We're excited to have you as part of our agricultural financing community.</p>
            <p>With AgricLend, you can:</p>
            <ul>
              <li>Apply for agricultural loans with competitive rates</li>
              <li>Track your loan applications in real-time</li>
              <li>Build your agricultural credit score</li>
              <li>Access seasonal repayment options</li>
            </ul>
            <p>Get started by applying for your first loan or exploring our platform features.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">Go to Dashboard</a>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} AgricLend. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"AgricLend" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to AgricLend - Your Agricultural Financing Partner',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendLoanStatusEmail,
  sendWelcomeEmail
};
