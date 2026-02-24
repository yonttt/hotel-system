import AdjustmentPageTemplate from '../../../components/AdjustmentPageTemplate'

const AdjLaundry = () => {
  return (
    <AdjustmentPageTemplate
      category="laundry"
      title="Adjustment - Laundry"
      subtitle="Laundry adjustment and corrections"
      icon="🧺"
      adjTypes={[
        'Price Correction',
        'Order Correction',
        'Void Transaction',
        'Bill Modification',
        'Refund',
        'Discount'
      ]}
    />
  )
}

export default AdjLaundry
