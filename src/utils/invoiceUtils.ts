import { Facture, Commande } from '../data/mockData';
import { formatMontant, formatDate, getStatutPaiementLabel } from './format';

/**
 * Génère et télécharge une facture en PDF
 */
export function generateInvoicePDF(facture: Facture, commande: Commande | undefined, companyLogo?: string): void {
  // Créer une fenêtre d'impression avec le contenu formaté
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les popups pour télécharger la facture');
    return;
  }

  const html = generateInvoiceHTML(facture, commande, companyLogo);
  printWindow.document.write(html);
  printWindow.document.close();

  // Attendre que le contenu soit chargé puis déclencher l'impression/téléchargement
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

/**
 * Imprime la facture
 */
export function printInvoice(facture: Facture, commande: Commande | undefined, companyLogo?: string): void {
  generateInvoicePDF(facture, commande, companyLogo);
}

/**
 * Génère le HTML de la facture
 */
function generateInvoiceHTML(facture: Facture, commande: Commande | undefined, companyLogo?: string): string {
  const lignes = commande?.lignes || [];

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture ${facture.numero}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      color: #2C3E50;
      padding: 40px;
      font-size: 12px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2D5016;
    }
    .company-info { flex: 1; }
    .company-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin-bottom: 10px;
    }
    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #2D5016;
      margin-bottom: 5px;
    }
    .company-details {
      font-size: 11px;
      color: #6C757D;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: bold;
      color: #2D5016;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 14px;
      color: #6C757D;
    }
    .client-section {
      background: #F8F9FA;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .client-label {
      font-size: 10px;
      text-transform: uppercase;
      color: #6C757D;
      margin-bottom: 5px;
    }
    .client-name {
      font-size: 16px;
      font-weight: bold;
      color: #2C3E50;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    thead {
      background: #2D5016;
      color: white;
    }
    th {
      padding: 10px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #E9ECEF;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #E9ECEF;
    }
    .total-row.final {
      border-top: 2px solid #2D5016;
      border-bottom: none;
      font-size: 16px;
      font-weight: bold;
      color: #2D5016;
      padding-top: 12px;
    }
    .payment-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    .status-payé { background: #D4EDDA; color: #155724; }
    .status-partiel { background: #FFF3CD; color: #856404; }
    .status-non_payé { background: #F8D7DA; color: #721C24; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E9ECEF;
      text-align: center;
      font-size: 10px;
      color: #6C757D;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      ${companyLogo ? `<img src="${companyLogo}" class="company-logo" alt="Logo" />` : ''}
      <div class="company-name">Lazan'iBetsileo</div>
      <div class="company-details">
        Région Betsileo, Madagascar<br>
        Tél: +261 20 75 000 00<br>
        Email: contact@lazanimbetsileo.mg<br>
        NIF: 123 456 789 012
      </div>
    </div>
    <div class="invoice-info">
      <div class="invoice-title">FACTURE</div>
      <div class="invoice-number">${facture.numero}</div>
      <div style="margin-top: 10px; font-size: 11px; color: #6C757D;">
        Date: ${formatDate(facture.dateCreation)}<br>
        Échéance: ${formatDate(facture.dateEcheance)}
      </div>
      <div style="margin-top: 10px;">
        <span class="payment-status status-${facture.statutPaiement}">
          ${getStatutPaiementLabel(facture.statutPaiement)}
        </span>
      </div>
    </div>
  </div>

  <div class="client-section">
    <div class="client-label">Facturé à</div>
    <div class="client-name">${facture.nomClient}</div>
    <div style="font-size: 11px; color: #6C757D; margin-top: 5px;">
      Commande: ${facture.numeroCommande}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="text-center">Qté</th>
        <th class="text-right">Prix unitaire</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${lignes.map(ligne => `
        <tr>
          <td>${ligne.nomProduit}</td>
          <td class="text-center">${ligne.quantite}</td>
          <td class="text-right">${formatMontant(ligne.prixUnitaire)}</td>
          <td class="text-right">${formatMontant(ligne.total)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Sous-total HT</span>
      <span>${formatMontant(facture.montantTotal)}</span>
    </div>
    <div class="total-row">
      <span>TVA (0%)</span>
      <span>${formatMontant(0)}</span>
    </div>
    <div class="total-row final">
      <span>Total TTC</span>
      <span>${formatMontant(facture.montantTotal)}</span>
    </div>
    ${facture.montantPaye > 0 ? `
      <div class="total-row" style="color: #28A745;">
        <span>Montant payé</span>
        <span>${formatMontant(facture.montantPaye)}</span>
      </div>
    ` : ''}
    ${facture.montantTotal - facture.montantPaye > 0 ? `
      <div class="total-row" style="color: #DC3545; font-weight: bold;">
        <span>Reste à payer</span>
        <span>${formatMontant(facture.montantTotal - facture.montantPaye)}</span>
      </div>
    ` : ''}
  </div>

  <div class="footer">
    <p>Merci pour votre confiance - Lazan'iBetsileo</p>
    <p>Ce document a été généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}</p>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #2D5016; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
      Imprimer / Sauvegarder en PDF
    </button>
  </div>
</body>
</html>
  `;
}
