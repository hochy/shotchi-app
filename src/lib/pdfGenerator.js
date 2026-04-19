import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { format, parseISO } from 'date-fns';

/**
 * Generates and shares a PDF report for a doctor visit.
 */
export const generateDoctorReport = async ({ profile, injections, weights, sideEffects }) => {
  const dateStr = format(new Date(), 'MMMM d, yyyy');
  
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #7BAF8E; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; color: #7BAF8E; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #444; border-left: 4px solid #7BAF8E; padding-left: 10px; }
          
          .stats-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f9f9f9; padding: 20px; borderRadius: 10px; }
          .stat-item { text-align: center; flex: 1; }
          .stat-value { font-size: 20px; font-weight: bold; color: #333; }
          .stat-label { font-size: 12px; color: #999; text-transform: uppercase; margin-top: 4px; }

          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { text-align: left; background-color: #f2f2f2; padding: 12px; font-size: 12px; text-transform: uppercase; color: #666; }
          td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: top; }
          
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          .chip { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #E8F5E9; color: #2E7D32; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Shotchi Patient Report</div>
          <div class="subtitle">Generated on ${dateStr}</div>
        </div>

        <div class="section">
          <div class="section-title">Summary</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${profile?.preferred_drug || 'Unspecified'}</div>
              <div class="stat-label">Medication</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${profile?.preferred_dosage || '0.25'} mg</div>
              <div class="stat-label">Current Dose</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${injections.length}</div>
              <div class="stat-label">Total Shots</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${weights.length > 0 ? weights[0].weight : '--'} lbs</div>
              <div class="stat-label">Latest Weight</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Injection History</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Medication / Dose</th>
                <th>Site</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${injections.slice(0, 20).map(inj => `
                <tr>
                  <td><strong>${format(parseISO(inj.scheduled_for), 'MMM d, yyyy')}</strong></td>
                  <td>${inj.drug_name || 'GLP-1'}<br/><span class="chip">${inj.dosage || '0.25'} mg</span></td>
                  <td>${inj.injection_site?.replace('_', ' ').toUpperCase() || 'Not noted'}</td>
                  <td>${inj.note || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${sideEffects.length > 0 ? `
          <div class="section">
            <div class="section-title">Reported Side Effects</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symptom</th>
                  <th>Severity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${sideEffects.slice(0, 10).map(se => `
                  <tr>
                    <td>${format(parseISO(se.logged_at), 'MMM d, h:mm a')}</td>
                    <td><strong>${se.symptom}</strong></td>
                    <td>Level ${se.severity}/5</td>
                    <td>${se.notes || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="footer">
          This report was generated by <strong>Shotchi</strong> - Your GLP-1 health companion.
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    console.log('PDF generated at:', uri);
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error('Error generating or sharing PDF:', error);
    throw error;
  }
};
