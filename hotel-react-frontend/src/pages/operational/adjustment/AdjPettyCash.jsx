import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjPettyCash = () => {
  return (
    <AdjustmentPageTemplate
      category="petty_cash"
      title="Adjustment - Petty Cash"
      subtitle="Petty cash adjustment and corrections"
      icon="💵"
      adjTypes={[
        'Cash Correction',
        'Void Transaction',
        'Receipt Modification',
        'Expense Correction',
        'Balance Reconciliation',
        'Addition'
      ]}
    />
  )
}

export default AdjPettyCash
