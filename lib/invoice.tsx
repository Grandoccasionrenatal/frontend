import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const ORANGE = '#d96f00';
const GRAY = '#666666';
const BORDER = '#e0e0e0';
const LIGHT = '#f9f6f2';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1a1a1a',
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 50,
    backgroundColor: '#ffffff',
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  logoLetter: {
    fontSize: 52,
    color: ORANGE,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  logoName: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
    marginTop: 2,
    color: '#1a1a1a',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceWord: {
    fontSize: 30,
    color: '#1a1a1a',
    letterSpacing: 3,
  },
  invoiceNum: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
  },
  balanceLabel: {
    fontSize: 8,
    color: GRAY,
    marginTop: 10,
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    marginTop: 1,
  },

  // ── Business Info ────────────────────────────────────────
  bizSection: {
    marginBottom: 22,
    paddingBottom: 16,
    borderBottom: `1 solid ${BORDER}`,
  },
  bizName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  bizLine: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.5,
  },

  // ── Bill To / Dates ──────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  billToLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: ORANGE,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  billToName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  billToLine: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.5,
  },
  datesBlock: {
    width: 190,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: `0.5 solid ${BORDER}`,
  },
  dateLabel: {
    fontSize: 8.5,
    color: GRAY,
  },
  dateValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Items Table ──────────────────────────────────────────
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: ORANGE,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  thText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottom: `0.5 solid ${BORDER}`,
  },
  tableRowAlt: {
    backgroundColor: LIGHT,
  },
  colNum: { width: 22 },
  colDesc: { flex: 1 },

  // ── Totals ───────────────────────────────────────────────
  totalsWrapper: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  totalsBox: {
    width: 230,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottom: `0.5 solid ${BORDER}`,
  },
  totalLabel: {
    fontSize: 8.5,
    color: GRAY,
  },
  totalValue: {
    fontSize: 8.5,
  },
  paymentValue: {
    fontSize: 8.5,
    color: '#2a9d4e',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    marginTop: 2,
    borderTop: `1.5 solid #1a1a1a`,
  },
  balanceLabelFinal: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  balanceValueFinal: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: ORANGE,
  },

  // ── Page 2: Bank Details ─────────────────────────────────
  bankTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: `1 solid ${BORDER}`,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bankLabel: {
    fontSize: 9,
    color: GRAY,
    width: 110,
  },
  bankValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  footerNote: {
    marginTop: 30,
    paddingTop: 12,
    borderTop: `0.5 solid ${BORDER}`,
    fontSize: 8,
    color: GRAY,
    lineHeight: 1.5,
  },
});

function fmt(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function parseItems(raw: string): string[] {
  if (!raw) return [];
  const byLine = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (byLine.length > 1) return byLine;
  return raw.split(',').map(l => l.trim()).filter(Boolean);
}

export interface InvoiceData {
  customer_name: string;
  event_date: string;
  delivery_date?: string;
  pickup_date?: string;
  event_location: string;
  items: string;
  total_amount: string;
  deposit_amount: string;
  reference_code?: string;
}

export function InvoicePDF({ data, invoiceDate }: { data: InvoiceData; invoiceDate: string }) {
  const items = parseItems(data.items);
  const total = parseFloat(data.total_amount || '0');
  const deposit = parseFloat(data.deposit_amount || '0');
  const balance = total - deposit;
  const invoiceNum = data.reference_code
    ? `INV-${data.reference_code.toUpperCase()}`
    : `INV-${invoiceDate.replace(/-/g, '')}`;

  return (
    <Document>
      {/* ── PAGE 1 ── */}
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoLetter}>G</Text>
            <Text style={styles.logoName}>GRAND OCCASION RENTAL</Text>
          </View>
          <View style={styles.invoiceRight}>
            <Text style={styles.invoiceWord}>INVOICE</Text>
            <Text style={styles.invoiceNum}>{invoiceNum}</Text>
            <Text style={styles.balanceLabel}>Balance Due</Text>
            <Text style={styles.balanceAmount}>€{balance.toFixed(2)}</Text>
          </View>
        </View>

        {/* Business Info */}
        <View style={styles.bizSection}>
          <Text style={styles.bizName}>Grand Occasion Rental Limited</Text>
          <Text style={styles.bizLine}>1 Talbot Terrace, Browneshill Rd, Carlow</Text>
          <Text style={styles.bizLine}>Carlow R93R7Y5, Ireland</Text>
          <Text style={styles.bizLine}>VAT ID: 4430662LH</Text>
          <Text style={styles.bizLine}>info@grandoccasionrental.ie</Text>
          <Text style={styles.bizLine}>https://www.grandoccasionrental.ie</Text>
        </View>

        {/* Bill To + Dates */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.billToLabel}>Bill To</Text>
            <Text style={styles.billToName}>{data.customer_name}</Text>
            <Text style={styles.billToLine}>{data.event_location}</Text>
            {data.delivery_date && (
              <Text style={styles.billToLine}>Delivery: {fmt(data.delivery_date)}</Text>
            )}
            {data.pickup_date && (
              <Text style={styles.billToLine}>Pick-up: {fmt(data.pickup_date)}</Text>
            )}
          </View>
          <View style={styles.datesBlock}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Invoice Date :</Text>
              <Text style={styles.dateValue}>{fmt(invoiceDate)}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Terms :</Text>
              <Text style={styles.dateValue}>Due on Receipt</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Event Date :</Text>
              <Text style={styles.dateValue}>{fmt(data.event_date)}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, styles.colNum]}>#</Text>
            <Text style={[styles.thText, styles.colDesc]}>Description</Text>
          </View>
          {items.map((item, idx) => (
            <View
              key={idx}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={[{ fontSize: 9 }, styles.colNum]}>{idx + 1}</Text>
              <Text style={[{ fontSize: 9 }, styles.colDesc]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Payment Made</Text>
              <Text style={styles.paymentValue}>(-) €{deposit.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabelFinal}>Balance Due</Text>
              <Text style={styles.balanceValueFinal}>€{balance.toFixed(2)}</Text>
            </View>
          </View>
        </View>

      </Page>

      {/* ── PAGE 2: Bank Details ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.bankTitle}>Bank Transfer Details</Text>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Company Name</Text>
          <Text style={styles.bankValue}>Grand Occasion Rental Limited</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>IBAN</Text>
          <Text style={styles.bankValue}>IE19 BOFI 9009 6547 7115 71</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>BIC</Text>
          <Text style={styles.bankValue}>BOFIIE2D</Text>
        </View>
        <Text style={styles.footerNote}>
          Please use your invoice number ({invoiceNum}) as the payment reference.{'\n'}
          For any queries contact us at info@grandoccasionrental.ie or call 085 156 3498.
        </Text>
      </Page>
    </Document>
  );
}
