// api/postback.js
import fs from 'fs';
import path from 'path';

/**
 * Postback URL - Serverless Function for Vercel
 * يدعم أي حدث من التطبيق أو الشبكة الإعلانية
 */

export default function handler(req, res) {
  try {
    // استقبال البيانات من الرابط
    const user_id  = req.query.user_id || 'unknown';
    const event    = req.query.event || 'unknown';
    const campaign = req.query.campaign_id || 'unknown';
    const value    = req.query.value || '0';
    const device   = req.query.device || 'unknown';
    const country  = req.query.country || 'unknown';

    const timestamp = new Date().toISOString();

    // تنسيق البيانات بشكل جميل للـ log
    const logLine = `
==============================
Time: ${timestamp}
User ID: ${user_id}
Event: ${event}
Campaign ID: ${campaign}
Value: ${value}
Device: ${device}
Country: ${country}
==============================
`;

    // مسار مؤقت صالح للكتابة على Vercel
    const logFile = path.join('/tmp', 'postback_log.txt');
    fs.appendFileSync(logFile, logLine);

    console.log(logLine); // يظهر في Vercel Logs

    // الرد بشكل JSON على الشبكة أو التطبيق
    res.status(200).json({
      status: 'success',
      message: 'Event recorded successfully',
      data: {
        event,
        user_id,
        campaign,
        value,
        device,
        country,
        timestamp
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
