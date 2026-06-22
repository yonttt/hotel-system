import AdjustmentPageTemplate from '../../../ui/AdjustmentPageTemplate'

const AdjFrontOffice = () => {
  return (
    <AdjustmentPageTemplate
      category="front_office"
      title="Adjustment - Front Office"
      subtitle="Corrections for room charges, deposits, and stay details"
      icon="🏨"
      adjTypes={[
        'Room Charge Correction',
        'Deposit Correction',
        'Rate Override',
        'Date Correction',
        'Folio Correction',
        'Void Charge',
        'Discount'
      ]}
    />
  )
}

export default AdjFrontOffice
