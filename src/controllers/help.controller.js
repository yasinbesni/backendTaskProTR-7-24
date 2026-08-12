

// Controller, request'i alıp ve yardmcı fonksiyonu çağırıck.

import { sendHelpEmail } from '../helpers/sendHelpEmail.js';

export const sendHelpRequest = async (req, res, next) => {
  try {
    const { email, comment } = req.body;
    if (!email || !comment) {
      return res.status(400).json({ message: 'Email and comment are required.' });
    }

    console.log('Sending help email to:', email);
    await sendHelpEmail(email, comment);
    console.log('Help email sent successfully');

    return res.status(200).json({ message: 'Help request successfully sent.' });
  } catch (err) {
    console.error('Help request error:', err);
    next(err);
  }
};