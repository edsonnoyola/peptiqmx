#!/bin/bash

# PEPTIQ ROI Tracker - Setup Automático
# Este script hace TODO por ti

echo "🚀 PEPTIQ ROI TRACKER - Setup Automático"
echo ""
echo "Este script va a:"
echo "1. Abrir Google Sheets"
echo "2. Abrir Apps Script"
echo "3. Copiar el código al clipboard"
echo ""
echo "Tú solo necesitas:"
echo "- Pegar (⌘+V) cuando se abra Apps Script"
echo "- Click en Run"
echo ""
read -p "¿Listo? Presiona ENTER para continuar..."

# Paso 1: Abrir Google Sheets
echo ""
echo "📊 Abriendo Google Sheets..."
open "https://sheets.google.com/create"
sleep 3

# Paso 2: Mostrar instrucciones
echo ""
echo "✅ Google Sheets abierto"
echo ""
echo "AHORA HAZ ESTO:"
echo "1. En Google Sheets, ve al menú: Extensions → Apps Script"
echo "2. Espera a que se abra Apps Script"
echo ""
read -p "Presiona ENTER cuando Apps Script esté abierto..."

# Paso 3: Copiar script al clipboard
echo ""
echo "📋 Copiando script al clipboard..."
cat << 'EOF' | pbcopy
function setupROITracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet1 = ss.getSheets()[0];
  sheet1.setName('DAILY TRACKING');

  ss.insertSheet('WEEKLY SUMMARY');
  ss.insertSheet('PRODUCT MIX');
  ss.insertSheet('AD PERFORMANCE');
  ss.insertSheet('MONTHLY P&L');
  ss.insertSheet('GOALS & TARGETS');

  setupDailyTracking(ss);
  setupWeeklySummary(ss);
  setupProductMix(ss);
  setupAdPerformance(ss);
  setupMonthlyPL(ss);
  setupGoals(ss);

  SpreadsheetApp.getUi().alert('✅ ROI Tracker configurado!\n\nActualiza DAILY TRACKING cada mañana (10 min).');
}

function setupDailyTracking(ss) {
  const sheet = ss.getSheetByName('DAILY TRACKING');
  const headers = [['Fecha', 'Día', 'Ad Spend MXN', 'Posts IG', 'Reels', 'WhatsApp Msgs', 'Ventas #', 'Productos Vendidos', 'Revenue MXN', 'ROAS', 'CAC MXN', 'AOV MXN', 'Notas']];
  sheet.getRange(1, 1, 1, 13).setValues(headers);
  sheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  const week1Data = [['14-Abr', 'Lun', 0, 2, 1, 3, 0, '', 0, '', '', '', 'Setup día 1'],['15-Abr', 'Mar', 0, 2, 2, 8, 2, '1x BPC, 1x TB', 3898, '', '', '', 'Primeras ventas'],['16-Abr', 'Mié', 0, 1, 1, 12, 1, '1x NAD', 3299, '', '', '', ''],['17-Abr', 'Jue', 0, 2, 2, 15, 2, '2x BPC', 3398, '', '', '', ''],['18-Abr', 'Vie', 0, 1, 1, 8, 0, '', 0, '', '', '', ''],['19-Abr', 'Sáb', 0, 1, 0, 5, 1, '1x Stack', 3599, '', '', '', ''],['20-Abr', 'Dom', 0, 0, 2, 3, 0, '', 0, '', '', '', 'Preparando ads']];
  sheet.getRange(2, 1, 7, 13).setValues(week1Data);
  sheet.getRange(9, 1, 1, 2).setValues([['TOTAL SEM 1', '']]);
  sheet.getRange(9, 1, 1, 13).setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('C9').setFormula('=SUM(C2:C8)');sheet.getRange('D9').setFormula('=SUM(D2:D8)');sheet.getRange('E9').setFormula('=SUM(E2:E8)');sheet.getRange('F9').setFormula('=SUM(F2:F8)');sheet.getRange('G9').setFormula('=SUM(G2:G8)');sheet.getRange('I9').setFormula('=SUM(I2:I8)');sheet.getRange('J9').setFormula('=IF(C9=0,"∞",I9/C9)');sheet.getRange('K9').setFormula('=IF(G9=0,"",C9/G9)');sheet.getRange('L9').setFormula('=IF(G9=0,"",I9/G9)');sheet.getRange('M9').setValue('Orgánico');
  for (let row = 2; row <= 8; row++) {sheet.getRange(row, 10).setFormula(`=IF(C${row}=0,"∞",I${row}/C${row})`);sheet.getRange(row, 11).setFormula(`=IF(G${row}=0,"",C${row}/G${row})`);sheet.getRange(row, 12).setFormula(`=IF(G${row}=0,"",I${row}/G${row})`);}
  sheet.getRange(10, 1).setValue('');
  const week2Data = [['21-Abr', 'Lun', 500, 1, 1, 22, 2, '1x BPC, 1x TB', 3898, '', '', '', '🚀 ADS LIVE!'],['22-Abr', 'Mar', 500, 1, 1, 18, 1, '1x NAD', 3299, '', '', '', ''],['23-Abr', 'Mié', 500, 1, 1, 25, 3, '2x BPC, 1x GHK', 5597, '', '', '', 'Mejorando!'],['24-Abr', 'Jue', 500, 1, 1, 20, 2, '1x TB, 1x BPC', 3898, '', '', '', ''],['25-Abr', 'Vie', 500, 1, 1, 30, 4, '3x BPC, 1x Stack', 8696, '', '', '', '🔥 Best day!'],['26-Abr', 'Sáb', 500, 0, 2, 15, 2, '2x TB', 4398, '', '', '', ''],['27-Abr', 'Dom', 500, 1, 1, 10, 1, '1x Retatrutide', 7999, '', '', '', '']];
  sheet.getRange(11, 1, 7, 13).setValues(week2Data);
  for (let row = 11; row <= 17; row++) {sheet.getRange(row, 10).setFormula(`=IF(C${row}=0,"∞",I${row}/C${row})`);sheet.getRange(row, 11).setFormula(`=IF(G${row}=0,"",C${row}/G${row})`);sheet.getRange(row, 12).setFormula(`=IF(G${row}=0,"",I${row}/G${row})`);}
  sheet.getRange(18, 1, 1, 2).setValues([['TOTAL SEM 2', '']]);
  sheet.getRange(18, 1, 1, 13).setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('C18').setFormula('=SUM(C11:C17)');sheet.getRange('D18').setFormula('=SUM(D11:D17)');sheet.getRange('E18').setFormula('=SUM(E11:E17)');sheet.getRange('F18').setFormula('=SUM(F11:F17)');sheet.getRange('G18').setFormula('=SUM(G11:G17)');sheet.getRange('I18').setFormula('=SUM(I11:I17)');sheet.getRange('J18').setFormula('=I18/C18');sheet.getRange('K18').setFormula('=C18/G18');sheet.getRange('L18').setFormula('=I18/G18');sheet.getRange('M18').setValue('Primera semana ads');
  sheet.setColumnWidth(1, 80);sheet.setColumnWidth(2, 50);sheet.setColumnWidths(3, 9, 100);sheet.setColumnWidth(8, 150);sheet.setColumnWidth(13, 200);
  sheet.getRange('C:C').setNumberFormat('$#,##0');sheet.getRange('I:I').setNumberFormat('$#,##0');sheet.getRange('K:K').setNumberFormat('$#,##0');sheet.getRange('L:L').setNumberFormat('$#,##0');sheet.getRange('J:J').setNumberFormat('0.0');
  sheet.setFrozenRows(1);
}

function setupWeeklySummary(ss) {
  const sheet = ss.getSheetByName('WEEKLY SUMMARY');
  const headers = [['Semana', 'Fechas', 'Ad Spend', 'WhatsApp Msgs', 'Ventas #', 'Revenue', 'ROAS', 'CAC', 'Profit Neto', 'ROI %', 'Top Producto', 'Notas']];
  sheet.getRange(1, 1, 1, 12).setValues(headers);
  sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  const data = [[1, '14-20 Abr', 0, 54, 6, 14194, '∞', 0, 9936, '∞', 'BPC-157 (3)', 'Setup'],[2, '21-27 Abr', 3500, 140, 15, 37785, 10.8, 233, 22949, '656%', 'BPC-157 (7)', 'Ads live'],[3, '28-4 May', 4200, 180, 25, 62500, 14.9, 168, 39550, '942%', 'Stack (8)', 'Optimización'],[4, '5-11 May', 5000, 220, 35, 87500, 17.5, 143, 56250, '1125%', 'Stack (12)', 'Scaling']];
  sheet.getRange(2, 1, 4, 12).setValues(data);
  sheet.getRange(6, 1, 1, 2).setValues([['TOTAL MES 1', 'Abr-May']]);
  sheet.getRange(6, 1, 1, 12).setFontWeight('bold').setBackground('#d4af37').setFontColor('#000000');
  sheet.getRange('C6').setFormula('=SUM(C2:C5)');sheet.getRange('D6').setFormula('=SUM(D2:D5)');sheet.getRange('E6').setFormula('=SUM(E2:E5)');sheet.getRange('F6').setFormula('=SUM(F2:F5)');sheet.getRange('G6').setFormula('=F6/C6');sheet.getRange('H6').setFormula('=C6/E6');sheet.getRange('I6').setFormula('=SUM(I2:I5)');sheet.getRange('J6').setFormula('=(I6/C6)*100&"%"');
  sheet.setColumnWidths(1, 12, 120);
  sheet.getRange('C:C').setNumberFormat('$#,##0');sheet.getRange('F:F').setNumberFormat('$#,##0');sheet.getRange('H:H').setNumberFormat('$#,##0');sheet.getRange('I:I').setNumberFormat('$#,##0');sheet.getRange('G:G').setNumberFormat('0.0');
  sheet.setFrozenRows(1);
}

function setupProductMix(ss) {
  const sheet = ss.getSheetByName('PRODUCT MIX');
  const headers = [['Producto', 'Precio', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'TOTAL Ventas', 'Revenue Total', '% Revenue']];
  sheet.getRange(1, 1, 1, 9).setValues(headers);
  sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  const products = [['BPC-157 10mg', 1699, 3, 7, 9, 12, '', '', ''],['TB-500 10mg', 2199, 2, 5, 7, 9, '', '', ''],['NAD+ 500mg', 3299, 1, 3, 4, 6, '', '', ''],['Retatrutide 30mg', 7999, 0, 1, 2, 3, '', '', ''],['Tirzepatide 30mg', 6999, 0, 0, 1, 2, '', '', ''],['Stack Wolverine', 3599, 0, 0, 2, 5, '', '', ''],['GHK-Cu 100mg', 1899, 0, 1, 0, 0, '', '', ''],['Epithalon 50mg', 4299, 0, 0, 0, 1, '', '', '']];
  sheet.getRange(2, 1, 8, 9).setValues(products);
  for (let row = 2; row <= 9; row++) {sheet.getRange(row, 7).setFormula(`=SUM(C${row}:F${row})`);sheet.getRange(row, 8).setFormula(`=B${row}*G${row}`);}
  sheet.getRange(10, 1).setValue('TOTAL');
  sheet.getRange(10, 1, 1, 9).setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('C10').setFormula('=SUM(C2:C9)');sheet.getRange('D10').setFormula('=SUM(D2:D9)');sheet.getRange('E10').setFormula('=SUM(E2:E9)');sheet.getRange('F10').setFormula('=SUM(F2:F9)');sheet.getRange('G10').setFormula('=SUM(G2:G9)');sheet.getRange('H10').setFormula('=SUM(H2:H9)');
  for (let row = 2; row <= 9; row++) {sheet.getRange(row, 9).setFormula(`=H${row}/$H$10`);}
  sheet.setColumnWidth(1, 150);sheet.setColumnWidths(2, 8, 110);
  sheet.getRange('B:B').setNumberFormat('$#,##0');sheet.getRange('H:H').setNumberFormat('$#,##0');sheet.getRange('I:I').setNumberFormat('0.0%');
  sheet.setFrozenRows(1);
}

function setupAdPerformance(ss) {
  const sheet = ss.getSheetByName('AD PERFORMANCE');
  const headers = [['Campaign', 'Ad Set', 'Ad Name', 'Spend', 'Clicks', 'CTR %', 'CPC', 'Conversions', 'CPA', 'ROAS', 'Status', 'Acción']];
  sheet.getRange(1, 1, 1, 12).setValues(headers);
  sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  const examples = [['Conversiones Abr', 'Biohackers CDMX', 'COA Verificable v1', 800, 210, 1.69, 3.81, 4, 200, 8.5, '✅ Active', 'Scale'],['Conversiones Abr', 'Biohackers CDMX', 'Testimonial Médico', 600, 95, 1.03, 6.32, 1, 600, 2.8, '⚠️ Active', 'Watch'],['Conversiones Abr', 'Fitness Avanzado', 'Stack Wolverine', 500, 180, 2.05, 2.78, 3, 167, 12.9, '✅ Active', 'Scale'],['Conversiones Abr', 'Fitness Avanzado', 'Pureza Verificada', 400, 68, 0.91, 5.88, 0, 0, 0, '❌ Paused', 'Kill']];
  sheet.getRange(2, 1, 4, 12).setValues(examples);
  sheet.setColumnWidths(1, 3, 150);sheet.setColumnWidths(4, 9, 100);
  sheet.getRange('D:D').setNumberFormat('$#,##0');sheet.getRange('F:F').setNumberFormat('0.00%');sheet.getRange('G:G').setNumberFormat('$0.00');sheet.getRange('I:I').setNumberFormat('$#,##0');sheet.getRange('J:J').setNumberFormat('0.0');
  sheet.setFrozenRows(1);
}

function setupMonthlyPL(ss) {
  const sheet = ss.getSheetByName('MONTHLY P&L');
  sheet.getRange('A1').setValue('ABRIL 2026 - P&L').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A3').setValue('INGRESOS').setFontWeight('bold').setBackground('#d4af37');
  const revenue = [['Ventas Semana 1 (orgánico)', 14194],['Ventas Semana 2 (ads)', 37785],['Ventas Semana 3 (scale)', 62500],['Ventas Semana 4 (scale)', 87500]];
  sheet.getRange(4, 1, 4, 2).setValues(revenue);
  sheet.getRange('A8').setValue('TOTAL REVENUE').setFontWeight('bold');
  sheet.getRange('B8').setFormula('=SUM(B4:B7)').setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('A10').setValue('COSTOS VARIABLES').setFontWeight('bold').setBackground('#e06666');
  const cogs = [['COGS (30% del revenue)', '=B8*0.30'],['Envíos ($150 x pedido)', 12150],['Fees MercadoPago (3%)', '=B8*0.03']];
  sheet.getRange(11, 1, 3, 2).setValues(cogs);
  sheet.getRange('A14').setValue('TOTAL COGS').setFontWeight('bold');
  sheet.getRange('B14').setFormula('=SUM(B11:B13)').setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('A16').setValue('COSTOS FIJOS').setFontWeight('bold').setBackground('#f6b26b');
  const fixed = [['Ad Spend', 12700],['Media Buyer (freelance)', 10000],['Content Creator', 6000],['Herramientas', 1000],['Hosting', 500]];
  sheet.getRange(17, 1, 5, 2).setValues(fixed);
  sheet.getRange('A22').setValue('TOTAL FIJOS').setFontWeight('bold');
  sheet.getRange('B22').setFormula('=SUM(B17:B21)').setFontWeight('bold').setBackground('#f3f3f3');
  sheet.getRange('A24').setValue('RESULTADO').setFontSize(12).setFontWeight('bold').setBackground('#6aa84f').setFontColor('#ffffff');
  const result = [['Revenue', '=B8'],['- COGS', '=-B14'],['= Margen Bruto', '=B25+B26'],['- Costos Fijos', '=-B22'],['= PROFIT NETO', '=B27+B28'],['', ''],['ROI %', '=(B29/B22)*100&"%"'],['Margen Neto %', '=(B29/B8)*100&"%"']];
  sheet.getRange(25, 1, 8, 2).setValues(result);
  sheet.getRange('A29:B29').setFontSize(14).setFontWeight('bold').setBackground('#6aa84f').setFontColor('#ffffff');
  sheet.setColumnWidth(1, 200);sheet.setColumnWidth(2, 120);
  sheet.getRange('B:B').setNumberFormat('$#,##0');
}

function setupGoals(ss) {
  const sheet = ss.getSheetByName('GOALS & TARGETS');
  sheet.getRange('A1').setValue('METAS MENSUALES').setFontSize(12).setFontWeight('bold');
  const headers = [['Mes', 'Revenue Target', 'Ad Spend Budget', 'ROAS Mínimo', 'Ventas #', 'Profit Target', 'Status']];
  sheet.getRange(2, 1, 1, 7).setValues(headers);
  sheet.getRange(2, 1, 1, 7).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  const goals = [['Abr 2026', '150k-200k', '12k-15k', '>2.5', '75-100', '70k-100k', '🎯 En progreso'],['May 2026', '250k-300k', '25k-30k', '>3.0', '120-150', '120k-150k', '📅 Planeado'],['Jun 2026', '400k-450k', '40k-50k', '>3.0', '180-220', '200k-250k', '📅 Planeado']];
  sheet.getRange(3, 1, 3, 7).setValues(goals);
  sheet.getRange('A7').setValue('SEMÁFORO DE SALUD').setFontSize(12).setFontWeight('bold');
  const semaforo = [['Métrica', 'Verde ✅', 'Amarillo ⚠️', 'Rojo ❌', 'Actual'],['ROAS', '>3.0', '2.0-3.0', '<2.0', ''],['CAC', '<$250', '$250-400', '>$400', ''],['WhatsApp CR', '>35%', '25-35%', '<25%', ''],['Response Time', '<2h', '2-4h', '>4h', ''],['Engagement IG', '>3%', '2-3%', '<2%', '']];
  sheet.getRange(8, 1, 6, 5).setValues(semaforo);
  sheet.getRange(8, 1, 1, 5).setFontWeight('bold').setBackground('#1a1a1a').setFontColor('#ffffff');
  sheet.setColumnWidths(1, 5, 130);
  sheet.setFrozenRows(2);
}
EOF

echo "✅ Script copiado al clipboard"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "AHORA EN APPS SCRIPT:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. BORRA todo el código default"
echo "2. PEGA (⌘+V)"
echo "3. GUARDA (⌘+S)"
echo "4. Dropdown arriba: selecciona 'setupROITracker'"
echo "5. Click ▶️ RUN"
echo "6. Autoriza permisos (solo primera vez)"
echo "7. Espera 10 seg"
echo "8. Refresca el Google Sheet"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Listo! Tendrás 6 pestañas con TODO configurado"
echo ""
