import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjKos = () => {
  return (
    <AdjustmentPageTemplate
      category="kos"
      title="Adjustment - Kos"
      subtitle="Kos/boarding house adjustment and corrections"
      icon="🏠"
      adjTypes={[
        'Rent Adjustment',
        'Payment Correction',
        'Deposit Modification',
        'Utility Correction',
        'Refund',
        'Late Fee'
      ]}
    />
  )
}

export default AdjKos
