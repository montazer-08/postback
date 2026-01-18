// api/postback.js
import fs from 'fs';
import path from 'path';

/**
 * Postback URL - Serverless Function for Vercel
 * يدعم تتبع أي حدث: install, purchase, signup ...
 */

export default function handler(req, res) {
  try {
    // استقبال البيانات من الرابط (GET parameters)
    const user_id  = req.query.user_id || 'unknown';
    const event    = req.query.event || 'unknown';
    const campaign = req.query.campaign_id || 'unknown';
    const value    = req.query.value || '0';
    const device   = req.query.device || 'unknown';
    const country  = req.query.country || 'unknown';

    // تجهيز البيانات بشكل منسق
    const timestamp = new Date().toISOString();
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

    // حفظ البيانات في ملف نصي
    const logFile = path.join(process.cwd(), 'postback_log.txt');
    fs.appendFileSync(logFile, logLine);

    console.log(logLine); // للمتابعة في Vercel Logs

    // الرد بشكل منسق للمعلنين أو التطبيق
    res.status(200).json({
      status: 'success',
      message: 'Event recorded successfully',
      event: event,
      user_id: user_id,
      timestamp: timestamp
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}
